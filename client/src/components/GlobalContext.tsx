import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  SetStateAction,
  Dispatch,
} from "react";

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

  const updateGlobalState = (newState: GlobalState) => {
    setGlobalState({ ...globalState, ...newState });
  };

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
