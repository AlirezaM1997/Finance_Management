import React, { FC, ProviderProps, useState } from "react";

type voidFunc = (a: string) => string;

interface IThemeContext {
  token: string;
  setToken: (a: string) => void;
  parsIsoDate: voidFunc;
  mode:string;
  setMode: (a: 'light' | 'dark') => void;
}

const defaultState = {
  token: "",
  setToken: () => {
    throw new Error("context out of range");
  },
  parsIsoDate: () => {
    throw new Error("context out of range");
  },
  mode:'light',
  setMode :() => {
    throw new Error("context out of range");
  },
};

const Context = React.createContext<IThemeContext>(defaultState);

const Provider = ({ children }: any) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [token, setToken] = useState("");
  const parsIsoDate: voidFunc =  (date: string)=> {
    const months = [
      "Janury",
      "Februry",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const a = new Date(date);
    const year = a.getFullYear();
    const month = a.getMonth();
    const day = a.getDay();
    return `${months[month]} ${day} ,${year}`;
  };

  return (
    <Context.Provider
      value={{
        mode,
        setMode,
        token,
        setToken,
        parsIsoDate,
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
