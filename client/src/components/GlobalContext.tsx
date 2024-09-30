import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import {
  matchPath,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { isWechat } from "../utils/wechat";
import { routes } from "../routes";
import wx from "weixin-js-sdk";
import { useQuery } from "react-query";
import { matchingEventApi } from "../api";
import { MatchingEventResponse } from "../api/matching-event";
import { toChineseDateTime } from "../utils/get-formatted-date-time-string";
import FullScreenLoader from "./FullScreenLoader";

interface GlobalState {
  [key: string]: any;
}

interface GlobalContextValue {
  matchingEvent: MatchingEventResponse | undefined;
  globalState: GlobalState;
  updateGlobalState: (newState: GlobalState) => void;
}
interface SnackBarContextValue {
  snackBarContent: {
    content: string | undefined;
    level: "info" | "error" | "success" | "warning";
  };
  setSnackBarContent: (
    content: string | undefined,
    level?: "info" | "error" | "success" | "warning"
  ) => void;
}

const GlobalContext = createContext<GlobalContextValue & SnackBarContextValue>({
  matchingEvent: undefined,
  globalState: {},
  updateGlobalState: () => null,
  snackBarContent: { content: undefined, level: "info" },
  setSnackBarContent: () => null,
});

const GlobalProvider = ({ children }: { children?: ReactNode }) => {
  const [globalState, setGlobalState] = useState<GlobalState>({});
  const [snackBarContent, setSnackBar] = useState<{
    content: string | undefined;
    level: "info" | "error" | "success" | "warning";
  }>({ content: undefined, level: "info" });
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isExcludedRoute = [routes.allEvents()].some((route) =>
    matchPath(route, location.pathname)
  );

  const matchingEventQuery = useQuery(
    ["matching-event", eventId],
    () =>
      eventId
        ? matchingEventApi.getMatchingEventById(eventId)
        : matchingEventApi.getLatestMatchingEvent(),
    {
      onSuccess(data) {
        if (!data) return;
        // always require an event id in url, unless it is excluded routes
        if (!isExcludedRoute && !eventId) navigate(routes.eventCover(data.id));
      },
      select: (data) => {
        return {
          ...data,
          matchingStartsAt: toChineseDateTime(data.matchingStartsAt),
          choosingStartsAt: toChineseDateTime(data.choosingStartsAt),
        };
      },
      retry: false,
      refetchOnWindowFocus: true,
    }
  );

  const updateGlobalState = (newState: GlobalState) => {
    setGlobalState({ ...globalState, ...newState });
  };

  const setSnackBarContent = (
    content: string | undefined,
    level: "info" | "error" | "success" | "warning" = "info"
  ) => {
    setSnackBar({ content, level });
  };

  useEffect(() => {
    if (!isWechat || !matchingEventQuery.data) return;
    const shareConfig = {
      title: `${matchingEventQuery.data.title}`,
      desc: "有趣社交，总有惊喜的创意类脱单",
      link:
        "https://ludigi.work" + routes.eventCover(matchingEventQuery.data.id),
      imgUrl: "https://ludigi.work/logo192.png",
      success: function () {},
    };
    wx.ready(function () {
      wx.updateAppMessageShareData(shareConfig);
      wx.updateTimelineShareData(shareConfig);
    });
  }, [eventId, matchingEventQuery.data]);

  return (
    <GlobalContext.Provider
      value={{
        matchingEvent: matchingEventQuery.data,
        globalState,
        updateGlobalState,
        snackBarContent,
        setSnackBarContent,
      }}
    >
      {!!matchingEventQuery.data ? children : <FullScreenLoader loading />}
    </GlobalContext.Provider>
  );
};

const useGlobalState = (): GlobalContextValue => {
  const { globalState, matchingEvent, updateGlobalState } =
    useContext(GlobalContext);
  return { globalState, updateGlobalState, matchingEvent };
};

const useSnackbarState = (): SnackBarContextValue => {
  const { snackBarContent, setSnackBarContent } = useContext(GlobalContext);
  return { snackBarContent, setSnackBarContent };
};

export { GlobalProvider, useGlobalState, useSnackbarState };
