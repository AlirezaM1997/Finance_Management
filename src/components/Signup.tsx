import React, { ChangeEvent, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

type FormValues = {
  username: string;
  password: string;
  name: string;
};

const REGISTER_MUTATION = gql`
  mutation Mutation($name: String!, $username: String!, $password: String!) {
    signup(name: $name, username: $username, password: $password) {
      token
    }
  }
`;

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: "",
      name: "",
    },
  });


  const [send_muation] = useMutation(REGISTER_MUTATION);

  const cookies = new Cookies();

  const onSubmit = handleSubmit(async (data) => {
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
    if (data.name === "") {
      setError(
        "name",
        {
          type: "bad input",
          message: "please fill this field",
        },
        { shouldFocus: true }
      );
    }
    if (data.name !== "" && data.password !== "" && data.username !== "") {
      try {
        const {
          data: {
            signup: { token },
          },
        } = await send_muation({
          variables: {
            name: data.name,
            username: data.username,
            password: data.password,
          },
        });
        console.log(token);

        // cookies.set(token)
        // if (status === 200) alert("ok");
      } catch (error) {
        console.log(error);
      }
    }
  });

  return (
    <div>
      <h1>sign up</h1>
      <form onSubmit={onSubmit}>
        <input
          placeholder="name"
          {...register("name")}
          name="name"
          type="text"
          id="name"
        ></input>
        <span className="invalid-feedback">{errors.name?.message}</span>

        <input
          placeholder="username"
          {...register("username")}
          name="username"
          type="text"
          id="username"
        ></input>
        <span className="invalid-feedback">{errors.username?.message}</span>

        <input
          placeholder="password"
          {...register("password")}
          name="password"
        ></input>
        <span className="invalid-feedback">{errors.password?.message}</span>

        <button type="submit">submit</button>
      </form>
      <Link to={"/"}>Login</Link>
    </div>
  );
}

export default Signup;
