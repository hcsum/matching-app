import React, { createContext, useState, useContext, ReactNode } from "react";

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

const GlobalContext = createContext<GlobalContextValue>({
  globalState: {},
  updateGlobalState: () => {},
});

const GlobalProvider: React.FC = ({ children }: { children?: ReactNode }) => {
  const [globalState, setGlobalState] = useState<GlobalState>({});

  const updateGlobalState = (newState: GlobalState) => {
    setGlobalState({ ...globalState, ...newState });
  };

  return (
    <GlobalContext.Provider value={{ globalState, updateGlobalState }}>
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalState = (): GlobalContextValue => {
  const { globalState, updateGlobalState } = useContext(GlobalContext);
  return { globalState, updateGlobalState };
};

export { GlobalProvider, useGlobalState };

