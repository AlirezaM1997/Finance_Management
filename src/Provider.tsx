import React, { FC, useState } from "react";

interface IThemeContext {
  token: string;
  setToken: (a: string) => void;
}

const defaultState = {
  token: "",
  setToken: () => {
    throw new Error("context out of range");
  },
};

const Context = React.createContext<IThemeContext>(defaultState);

const Provider = ({ children }: any) => {
  const [token, setToken] = useState("");
  return (
    <Context.Provider
      value={{
        token,
        setToken,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export default Provider;

export function useAllState() {
  return React.useContext(Context);
}
