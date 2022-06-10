import * as React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { useAllState } from "../Provider";
import { gql, useMutation } from "@apollo/client";
import Cookies from "universal-cookie";

//mui
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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
  const cookies = new Cookies();
  const { setToken } = useAllState();
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
      if (token) {
        cookies.set("token", token);
        setToken(token);
        toast.success("You have successfully registered!");
        setTimeout(() => navToDashboard("/dashboard"), 3000);
      }

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
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                Do you have an account?<Link style={{color:'red'}} to={"/"}>{" Sign In"}</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <ToastContainer  pauseOnHover={false} toastStyle={{background : 'white', color:'black'}}/>
    </ThemeProvider>
  );
}

