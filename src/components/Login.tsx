import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import Cookies from "universal-cookie";

type FormData = {
  username: string;
  password: string;
};

const LOGIN_MUTATION = gql`
  mutation Mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [send_muation] = useMutation(LOGIN_MUTATION);

  const cookies = new Cookies();

  const navToDashboard = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    // console.log(data, errors);
    if (data.username === "") {
      setError(
        "username",
        {
          type: "bad input",
          message: "please fill this field",
        },
        { shouldFocus: true }
      );
    }
    if (data.password === "") {
      setError(
        "password",
        {
          type: "bad input",
          message: "please fill this field",
        },
        { shouldFocus: true }
      );
    }
    if (data.username !== "" && data.password !== "") {
      try {
        const {
          data: {
            login: { token },
          },
        } = await send_muation({
          variables: {
            username: data.username,
            password: data.password,
          },
        });
        console.log(token);

        cookies.set("token", token);
        // if (status === 200) alert("ok");
        navToDashboard("/user/dashboard");
      } catch (error) {
        console.log(error);
      }
    }
  });

  return (
    <div className="p-5">
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div>
          <input
            {...register("username")}
            placeholder="username"
            name="username"
            type="text"
            id="username"
            className="bg-blue-400"
          ></input>
          <span className="invalid-feedback">{errors.username?.message}</span>
        </div>
        <div>
          <input
            placeholder="password"
            {...register("password")}
            name="password"
            type="password"
            id="password"
          ></input>
          <span className="invalid-feedback">{errors.password?.message}</span>
        </div>

        <button type="submit">submit</button>
      </form>
      <Link to={"/signup"}>signup</Link>
    </div>
  );
};

export default Login;
