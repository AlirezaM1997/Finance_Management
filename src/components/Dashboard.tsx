import React, { useState, useEffect, FC } from "react";
import { gql, useQuery } from "@apollo/client";
import { Outlet, Link } from "react-router-dom";

//mui
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
import NotificationsIcon from "@mui/icons-material/Notifications";
import { MainListItems, SecondaryListItems } from "./SideMenu";
import CircularProgress from "@mui/material/CircularProgress";

//chart
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { ArrowRight } from "@mui/icons-material";

const MAIN_QUERY = gql`
  query Query {
    me {
      name
      img
    }
    getMyExpenses {
      _id
      amount
      tags {
        _id
        name
        color
      }
      geo {
        lat
        lon
      }
      date
    }
    getMyTags {
      _id
      name
      color
    }
  }
`;

interface IData {
  me: { name: string; img: File };
  getMyExpenses: [
    {
      amount: number;
      date: string;
      tags: { _id: number; color: string; name: string };
      geo: { lat: number; lon: number };
      _id: number;
    }
  ];
  getMyTags: [
    {
      _id: number;
      color: string;
      name: string;
    }
  ];
}

const Dashboard: FC = () => {
  const [info, setInfo] = useState<IData>();

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

  ChartJS.register(ArcElement, Tooltip, Legend);

  const _data = {
    labels: info?.getMyTags.map((i) => i.name),
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: info?.getMyTags.map((i) => i.color),
      },
    ],
  };

  const arr: any[] = [];
  const _arr = info?.getMyExpenses.filter((i) => arr.concat(i.tags));
  console.log(_arr);

  const [open, setOpen] = useState(true);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
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

  const { error, loading, data } = useQuery(MAIN_QUERY, {
    onCompleted: setInfo,
  });

  if (error)
    return (
      <h3 style={{ textAlign: "center" }}>
        From Dashboard : You are not login!
      </h3>
    );
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
  console.log(info);

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
        {location.href === "/dashboard" ? (
          <Box
            pr="10px"
            pt="80px"
            width="100%"
            sx={{
              pl: { xs: "80px", md: "250px" },
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              fontFamily="system-ui"
              fontWeight="600"
              pb={2}
              sx={{
                textAlign: { xs: "center", md: "left" },
              }}
              component="div"
            >
              <ArrowRight
                sx={{
                  display: { xs: "none", md: "inline" },
                }}
              />
              Overview
            </Typography>
            <Box sx={{ p: "2.5rem" }}>
              <Pie data={_data} />
            </Box>
          </Box>
        ) : null}
      </ThemeProvider>
      <Outlet />
    </>
  );
};

export default Dashboard;
