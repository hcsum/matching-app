import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { useQuery } from "react-query";
import * as userApi from "../api/user";
import { routes } from "../routes";
import {
  matchPath,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

interface AuthState {
  user: userApi.User | undefined;
  isParticipant: boolean;
}

interface AuthContextValue {
  user: userApi.User | undefined;
  isParticipant: boolean;
  updateAuthState: (newState: AuthState) => void;
  wechatLogin: () => void;
  logout: () => void;
  refetchMe: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  isParticipant: false,
  updateAuthState: () => null,
  wechatLogin: () => null,
  logout: () => null,
  refetchMe: () => null,
});

const PublicRoutes = ["/", routes.eventCover()];

const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const location = useLocation();
  const [authState, setAuthState] = useState<AuthState>({
    user: undefined,
    isParticipant: false,
  });
  const isPublicRoute = PublicRoutes.some((route) =>
    matchPath(route, location.pathname)
  );

  const wechatLogin = useCallback(async () => {
    const APPID = process.env.REACT_APP_WECHAT_APP_ID;
    const REDIRECT_URI = `${process.env.REACT_APP_URL}/api/user/wechat-login?eventId=${eventId}`;
    const SCOPE = "snsapi_userinfo";
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&state=STATE#wechat_redirect`;
    window.location.href = url;
  }, [eventId]);

  const updateAuthState = useCallback(
    (newState: Partial<AuthState>) => {
      setAuthState({ ...authState, ...newState });
    },
    [authState]
  );

  const meQuery = useQuery(["me", eventId], userApi.getUserByAccessToken, {
    onSuccess: (data) => {
      updateAuthState({
        user: data,
        isParticipant: data.eventIds.includes(eventId!),
      });
    },
    onError: () => {
      updateAuthState({
        user: undefined,
      });
      eventId ? navigate(routes.eventCover(eventId)) : navigate("/");
    },
    refetchOnWindowFocus: true,
    retry: false,
  });

  // handle wechat redirect
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get("access_token");
    const eventId = queryParams.get("event_id");

    if (!accessToken || !eventId) return;

    localStorage.setItem("access_token", accessToken);
    navigate(routes.eventCover(eventId));
    return;
  }, [navigate]);

  const logout = useCallback(() => {
    updateAuthState({ user: undefined });
    localStorage.removeItem("access_token");
  }, [updateAuthState]);

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isParticipant: authState.isParticipant,
        updateAuthState,
        wechatLogin,
        logout,
        refetchMe: meQuery.refetch,
      }}
    >
      {authState.user || isPublicRoute ? children : null}
    </AuthContext.Provider>
  );
};

const useAuthState = (): AuthContextValue => {
  if (!useContext(AuthContext)) {
    throw new Error("useAuthState must be used within AuthProvider");
  }
  const {
    user,
    isParticipant,
    updateAuthState,
    wechatLogin,
    logout,
    refetchMe,
  } = useContext(AuthContext);
  return {
    user,
    isParticipant,
    updateAuthState,
    wechatLogin,
    logout,
    refetchMe,
  };
};

export { AuthProvider, useAuthState };
