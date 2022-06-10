import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import Cookies from "universal-cookie";
import { useAllState } from "../Provider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//mui
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";

const LOGIN_MUTATION = gql`
  mutation Mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

const theme = createTheme();
// console.log(theme);

export default function SignIn() {
  const [send_muation] = useMutation(LOGIN_MUTATION);
  const cookies = new Cookies();
  const navToDashboard = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { setToken } = useAllState();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const {
        data: {
          login: { token },
        },
      } = await send_muation({
        variables: {
          username: data.get("username"),
          password: data.get("password"),
        },
      });
      if (token) {
        cookies.set("token", token);
        setToken(token);
        toast.success("You have successfully logged in!");
        setTimeout(() => navToDashboard("/dashboard"), 3000);
      }
      console.log(token);
    } catch (error) {
      toast.error("The username or password you entered is incorrect");
      console.log(error);
      setLoading(false);
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <LoadingButton
              loading={loading}
              loadingPosition="start"
              startIcon={loading ? <SaveIcon /> : null}
              variant="contained"
              fullWidth
              sx={{ mt: 2, mb: 1 }}
              type="submit"
            >
              Sign In
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <Link to="#">Forgot password?</Link>
              </Grid>
              <Grid item>
                Don't have an account?{" "}
                <Link style={{ color: "red" }} to={"/signup"}>
                  {" Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <ToastContainer  pauseOnHover={false} toastStyle={{background : 'white', color:'black'}}/>
    </ThemeProvider>
  );
}
