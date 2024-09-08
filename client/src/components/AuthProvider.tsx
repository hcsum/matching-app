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
import { useNavigate } from "react-router-dom";

interface AuthState {
  user: userApi.User | undefined;
}

interface AuthContextValue {
  authState: AuthState;
  updateAuthState: (newState: AuthState) => void;
  wechatLogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  authState: {
    user: undefined,
  },
  updateAuthState: () => null,
  wechatLogin: () => null,
  logout: () => null,
});

const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: undefined,
  });

  const wechatLogin = useCallback(async () => {
    const APPID = process.env.REACT_APP_WECHAT_APP_ID;
    const REDIRECT_URI = `${process.env.REACT_APP_URL}/api/user/wechat-login`;
    const SCOPE = "snsapi_userinfo";
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&state=STATE#wechat_redirect`;
    window.location.href = url;
  }, []);

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
      navigate(routes.userHome(data.id));
    },
    onError: () => {
      updateAuthState({
        user: undefined,
      });
      navigate(routes.welcome());
    },
    retry: false,
    // enabled: !!localStorage.getItem("access_token"),
  });

  // handle wechat redirect
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get("access_token");
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      navigate(routes.userHome());
      return;
    }
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        authState,
        updateAuthState,
        wechatLogin,
        logout: () => updateAuthState({ user: undefined }),
      }}
    >
      {authState.user ? children : null}
    </AuthContext.Provider>
  );
};

const useAuthState = (): AuthContextValue => {
  const { authState, updateAuthState, wechatLogin, logout } =
    useContext(AuthContext);
  return { authState, updateAuthState, wechatLogin, logout };
};

export { AuthProvider, useAuthState };
