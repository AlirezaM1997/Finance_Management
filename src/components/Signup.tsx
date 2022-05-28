import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
// import Link from '@mui/material/Link';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Link, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import Cookies from "universal-cookie";
import { AccountCircle } from "@mui/icons-material";

const REGISTER_MUTATION = gql`
  mutation Mutation($name: String!, $username: String!, $password: String!) {
    signup(name: $name, username: $username, password: $password) {
      token
    }
  }
`;

const theme = createTheme();

export default function SignUp() {
  const [send_muation] = useMutation(REGISTER_MUTATION);
  // const cookies = new Cookies();
  const navToDashboard = useNavigate();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const {
        data: {
          signup: { token },
        },
      } = await send_muation({
        variables: {
          name: data.get("name"),
          username: data.get("username"),
          password: data.get("password"),
        },
      });
      // console.log(token);
      // cookies.set("token", token);
      navToDashboard('/dashboard')
      // if (status === 200) alert("ok");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <AccountCircle />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link to={"/"}>{"Do you have an account? Sign In"}</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
    </ThemeProvider>
  );
}

// import React, { ChangeEvent, useState } from "react";
// import { gql, useMutation } from "@apollo/client";
// import Cookies from "universal-cookie";
// import { Link } from "react-router-dom";
// import { useForm } from "react-hook-form";

// type FormValues = {
//   username: string;
//   password: string;
//   name: string;
// };

// const REGISTER_MUTATION = gql`
//   mutation Mutation($name: String!, $username: String!, $password: String!) {
//     signup(name: $name, username: $username, password: $password) {
//       token
//     }
//   }
// `;

// function Signup() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setError,
//   } = useForm<FormValues>({
//     defaultValues: {
//       username: "",
//       password: "",
//       name: "",
//     },
//   });

//   const [send_muation] = useMutation(REGISTER_MUTATION);

//   const cookies = new Cookies();

//   const onSubmit = handleSubmit(async (data) => {
//     if (data.username === "") {
//       setError(
//         "username",
//         {
//           type: "bad input",
//           message: "please fill this field",
//         },
//         { shouldFocus: true }
//       );
//     }
//     if (data.password === "") {
//       setError(
//         "password",
//         {
//           type: "bad input",
//           message: "please fill this field",
//         },
//         { shouldFocus: true }
//       );
//     }
//     if (data.name === "") {
//       setError(
//         "name",
//         {
//           type: "bad input",
//           message: "please fill this field",
//         },
//         { shouldFocus: true }
//       );
//     }
//     if (data.name !== "" && data.password !== "" && data.username !== "") {
//       try {
//         const {
//           data: {
//             signup: { token },
//           },
//         } = await send_muation({
//           variables: {
//             name: data.name,
//             username: data.username,
//             password: data.password,
//           },
//         });
//         console.log(token);

//         // cookies.set(token)
//         // if (status === 200) alert("ok");
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   });

//   return (
//     <div>
//       <h1>sign up</h1>
//       <form onSubmit={onSubmit}>
//         <input
//           placeholder="name"
//           {...register("name")}
//           name="name"
//           type="text"
//           id="name"
//         ></input>
//         <span className="invalid-feedback">{errors.name?.message}</span>

//         <input
//           placeholder="username"
//           {...register("username")}
//           name="username"
//           type="text"
//           id="username"
//         ></input>
//         <span className="invalid-feedback">{errors.username?.message}</span>

//         <input
//           placeholder="password"
//           {...register("password")}
//           name="password"
//         ></input>
//         <span className="invalid-feedback">{errors.password?.message}</span>

//         <button type="submit">submit</button>
//       </form>
//       <Link to={"/"}>Login</Link>
//     </div>
//   );
// }

// export default Signup;
