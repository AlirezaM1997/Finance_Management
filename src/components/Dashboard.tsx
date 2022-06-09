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
import Deposits from "./Deposits";
import CircularProgress from "@mui/material/CircularProgress";
import { Outlet, Link } from "react-router-dom";

const ME_QUERY = gql`
  query Query {
    me {
      name
      img
    }
  }
`;

interface IUser {
  me: { name: string; img: File };
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

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    console.log(open);
    
    const updateWindowDimensions = () => {
      const newHeight = window.innerWidth;
      setWidth(newHeight);
    };
    window.addEventListener("resize", updateWindowDimensions);
    if (width < 900) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [width]);

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
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px",
              // position:'fixed'
            }}
          >
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
            <Typography
              component="h6"
              fontSize="15px"
              variant="h6"
              noWrap
              ml="1rem"
            >
              {info?.me.name}
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
              {open ? (
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
          ) : null}
            </Toolbar>
          <Divider />
          <List component="nav">
            <MainListItems />
            <Divider sx={{ my: 1 }} />
            <SecondaryListItems />
          </List>
        </Drawer>
      </ThemeProvider>
      <Outlet />
    </>
  );
};

export default Dashboard;
