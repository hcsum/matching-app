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
  const [authState, setAuthState] = useState<AuthState>({
    user: undefined,
  });

  const wechatLogin = useCallback(async () => {
    const APPID = process.env.REACT_APP_WECHAT_APP_ID;
    const REDIRECT_URI = "https://luudii.com/api/user/wechat-login";
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
    },
    onError: () => {
      updateAuthState({
        user: undefined,
      });
    },
    refetchOnWindowFocus: true,
    enabled:
      !!localStorage.getItem("access_token") &&
      !["/login", "/login/"].includes(window.location.pathname),
  });

  useEffect(() => {
    // Check if the user is redirected from WeChat login
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get("access_token");
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      window.location.href = routes.userHome();
      return;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authState,
        updateAuthState,
        wechatLogin,
        logout: () => updateAuthState({ user: undefined }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuthState = (): AuthContextValue => {
  const { authState, updateAuthState, wechatLogin, logout } =
    useContext(AuthContext);
  return { authState, updateAuthState, wechatLogin, logout };
};

export { AuthProvider, useAuthState };
