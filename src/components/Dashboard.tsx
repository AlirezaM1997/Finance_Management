import React, { useState, useRef, useEffect, FC } from "react";
import { gql, useQuery } from "@apollo/client";

// import * as React from 'react';
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { MainListItems, SecondaryListItems } from "./SideMenu";
import Chart from "./Chart";
import Deposits from "./Deposits";
import CircularProgress from "@mui/material/CircularProgress";
import { Outlet, Link } from "react-router-dom";

const ME_QUERY = gql`
  query Query {
    me {
      username
      img
    }
  }
`;

interface IUser {
  me: { username: string; img: File };
}

const Dashboard: FC | any = () => {
  const drawerWidth: number = 240;

  interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    "& .MuiDrawer-paper": {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: "border-box",
      ...(!open && {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
          width: theme.spacing(9),
        },
      }),
    },
  }));

  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const mdTheme = createTheme();

  const [info, setInfo] = useState<IUser>();
  const { error, loading, data } = useQuery(ME_QUERY, {
    onCompleted: setInfo,
  });

  if (error) return <p>Dashboard : You are not login!!!</p>;
  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "2rem",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <ThemeProvider theme={mdTheme}>
        <>
          <CssBaseline />
          <AppBar position="absolute" open={open}>
            <Toolbar
              sx={{
                pr: "24px", // keep right padding when drawer closed
                // position:'fixed'
              }}
            >
              {/* <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton> */}
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                Dashboard
              </Typography>
              <IconButton color="inherit">
                <Badge badgeContent={0} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Typography component="h6" variant="h6" noWrap ml="1rem">
                {info?.me.username}
              </Typography>
              {info?.me.img ? (
                <Box
                  component="img"
                  sx={{
                    height: 40,
                    width: 40,
                    maxHeight: { xs: 40, md: 40 },
                    maxWidth: { xs: 35, md: 35 },
                    borderRadius: "50%",
                    mx: "10px",
                  }}
                  alt="avatar"
                  src={`http://localhost:80/${info?.me.img}`}
                />
              ) : null}
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            open={open}
            style={{
              display: "inline-block",
              position: "fixed",
              height: "100%",
            }}
          >
            <Toolbar
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: [1],
              }}
            >
              <Typography
                variant="h4"
                my={3}
                fontFamily="system-ui"
                fontWeight="600"
                align="center"
                component="div"
                color="gray"
              >
                Finance
                <Typography
                  variant="h6"
                  fontFamily="system-ui"
                  fontWeight="600"
                  align="center"
                  component="div"
                  color="gray"
                >
                  Management
                </Typography>
              </Typography>
              {/* <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton> */}
            </Toolbar>
            <Divider />
            <List component="nav">
              <MainListItems />
              <Divider sx={{ my: 1 }} />
              <SecondaryListItems />
            </List>
          </Drawer>
          {/* <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}> */}
          {/* Chart */}

          {/* <Grid item xs={12} md={8} lg={9}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: 240,
                    }}
                  >
                    <Chart />
                  </Paper>
                </Grid> */}
          {/* Recent Deposits */}
          {/* <Grid item xs={12} md={4} lg={3}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: 240,
                    }}
                  >
                    <Deposits />
                  </Paper>
                </Grid> */}
          {/* Recent Orders */}
          {/* <Grid item xs={12}>
                  <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column" }}
                  >
                    <Orders />
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </Box> */}
        </>
      </ThemeProvider>
      <Outlet />
    </>
  );
};

export default Dashboard;
