import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { isWechat } from "../utils/wechat";
import { routes } from "../routes";

interface GlobalState {
  [key: string]: any;
}

// if visit home '/', get latest matching event, and redirect to that event's main page
// then user can login from there
// if user is already logged in (credential in cookie), redirect to user home page

interface GlobalContextValue {
  globalState: GlobalState;
  updateGlobalState: (newState: GlobalState) => void;
}
interface SnackBarContextValue {
  snackBarContent: string | undefined;
  setSnackBarContent: Dispatch<SetStateAction<string | undefined>>;
}

const GlobalContext = createContext<GlobalContextValue & SnackBarContextValue>({
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

  const updateGlobalState = (newState: GlobalState) => {
    setGlobalState({ ...globalState, ...newState });
  };

  // always require an event, if not, redirect to '/' to get latest event
  useEffect(() => {
    if (!eventId && location.pathname !== "/") {
      navigate("/");
    }
  }, [eventId, location.pathname, navigate]);

  useEffect(() => {
    if (!isWechat || !eventId) return;
    const shareConfig = {
      title: "三天情侣",
      desc: "有趣社交，总有惊喜的创意类脱单",
      link: "https://luudii.com" + routes.eventCover(eventId),
      imgUrl: "https://luudii.com/logo192.png",
      success: function () {},
    };
    wx.ready(function () {
      wx.updateAppMessageShareData(shareConfig);
      wx.updateTimelineShareData(shareConfig);
    });
  }, [eventId]);

  return (
    <GlobalContext.Provider
      value={{
        globalState,
        updateGlobalState,
        snackBarContent,
        setSnackBarContent,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalState = (): GlobalContextValue => {
  const { globalState, updateGlobalState } = useContext(GlobalContext);
  return { globalState, updateGlobalState };
};

const useSnackbarState = (): SnackBarContextValue => {
  const { snackBarContent, setSnackBarContent } = useContext(GlobalContext);
  return { snackBarContent, setSnackBarContent };
};

export { GlobalProvider, useGlobalState, useSnackbarState };
