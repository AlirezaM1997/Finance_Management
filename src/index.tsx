import React, { FC, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Login from "./components/Login";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import CustomApolloProvider from "./apollo-client";
import Dashboard from "./components/Dashboard";
import Cookies from "universal-cookie";
import { gql, useQuery, useMutation } from "@apollo/client";

const ME_QUERY = gql`
  query Query {
    me {
      username
    }
  }
`;

interface Props {
  children: any;
  redirectTo: any;
}

const RequireAuth: FC<Props> = ({ children, redirectTo }) => {
  console.log('!!!!!!!!!!!!!!!');
  const[info , setInfo]=useState()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const cookies = new Cookies();

  // useEffect(() => {
    // const reqMe = async () => {
      const { error, loading, data } = useQuery(ME_QUERY, {
        onCompleted: setInfo
      });

      if (loading) return <p>Loading...</p>;
      if (error) console.log(error)
      
        if (!loading && !error) {
        console.log('data', data);
        // setIsAuthenticated(true);
        if (data) {
          console.log('ok');
          return children
          
        } else {
          console.log('no ok');
          
          return <Navigate to={redirectTo} />
        }
      }
    // };

    // reqMe();
  // }, []);

  // if (loading) {
  //   return <h1>loading ...</h1>;
  // } else {
  //   return isAuthenticated ? children : <Navigate to={redirectTo} />;
  // }
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <CustomApolloProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>

          <Route
            path="/user/dashboard"
            element={
              <RequireAuth redirectTo={"/"}>
                <Dashboard />
              </RequireAuth>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </CustomApolloProvider>
  </React.StrictMode>
);

reportWebVitals();
