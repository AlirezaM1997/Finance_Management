import React, { FC, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CustomApolloProvider from "./apollo-client";
import Cookies from "universal-cookie";

import Dashboard from "./components/Dashboard";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Provider, { useAllState } from "./Provider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const App = () => {
  const { setToken } = useAllState();
  const { token } = useAllState();

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    setToken(token);
  }, []);
  console.log("%c token in route :", "background: #222; color: #bada55", token);

  // console.log('token :', token);
  // if (!token) return

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <h2>loading ...!</h2>}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
};

root.render(
  <Provider>
    <React.StrictMode>
      <CustomApolloProvider>
        <App />
      </CustomApolloProvider>
    </React.StrictMode>
  </Provider>
);

reportWebVitals();
