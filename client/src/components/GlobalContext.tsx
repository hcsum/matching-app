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

interface GlobalState {
  [key: string]: any;
}

interface GlobalContextValue {
  matchingEvent: MatchingEventResponse | undefined;
  globalState: GlobalState;
  updateGlobalState: (newState: GlobalState) => void;
}
interface SnackBarContextValue {
  snackBarContent: string | undefined;
  setSnackBarContent: Dispatch<SetStateAction<string | undefined>>;
}

const GlobalContext = createContext<GlobalContextValue & SnackBarContextValue>({
  matchingEvent: undefined,
  globalState: {},
  updateGlobalState: () => null,
  snackBarContent: undefined,
  setSnackBarContent: () => null,
});

const GlobalProvider = ({ children }: { children?: ReactNode }) => {
  const [globalState, setGlobalState] = useState<GlobalState>({});
  const [snackBarContent, setSnackBarContent] = useState<string | undefined>();
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isExcludedRoute = ["/", routes.allEvents()].some((route) =>
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
      retry: false,
    }
  );

  const updateGlobalState = (newState: GlobalState) => {
    setGlobalState({ ...globalState, ...newState });
  };

  useEffect(() => {
    if (!isWechat || !matchingEventQuery.data) return;
    const shareConfig = {
      title: matchingEventQuery.data.title,
      desc: "有趣社交，总有惊喜的创意类脱单",
      link:
        "https://luudii.com" + routes.eventCover(matchingEventQuery.data.id),
      imgUrl: "https://luudii.com/logo192.png",
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
      {matchingEventQuery.isLoading ? <div>加载中。。。</div> : children}
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
