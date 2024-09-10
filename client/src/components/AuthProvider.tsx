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
}

interface AuthContextValue {
  user: userApi.User | undefined;
  updateAuthState: (newState: AuthState) => void;
  wechatLogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  updateAuthState: () => null,
  wechatLogin: () => null,
  logout: () => null,
});

const PublicRoutes = ["/", routes.eventCover()];

const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const location = useLocation();
  const [authState, setAuthState] = useState<AuthState>({
    user: undefined,
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
    (newState: AuthState) => {
      setAuthState({ ...authState, ...newState });
    },
    [authState]
  );

  useQuery(["me"], userApi.getUserByAccessToken, {
    onSuccess: (data) => {
      updateAuthState({
        user: data,
      });
    },
    onError: () => {
      updateAuthState({
        user: undefined,
      });
      navigate("/");
    },
    enabled: !isPublicRoute,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // handle wechat redirect
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get("access_token");
    const eventId = queryParams.get("event_id");

    if (!accessToken || !eventId) return;

    localStorage.setItem("access_token", accessToken);
    navigate(routes.userHome(eventId));
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
        updateAuthState,
        wechatLogin,
        logout,
      }}
    >
      {authState.user || isPublicRoute ? children : null}
    </AuthContext.Provider>
  );
};

const useAuthState = (): AuthContextValue => {
  const { user, updateAuthState, wechatLogin, logout } =
    useContext(AuthContext);
  return {
    user,
    updateAuthState,
    wechatLogin,
    logout,
  };
};

export { AuthProvider, useAuthState };
