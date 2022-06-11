import React, { useState, useEffect, FC } from "react";
import { gql, useQuery } from "@apollo/client";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAllState } from "../Provider";

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
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ArrowRight } from "@mui/icons-material";

//chart
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

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
  const location = useLocation();
  const { mode } = useAllState();
  const { setMode } = useAllState();
  const [info, setInfo] = useState<IData>();

  const toggleColorMode = () => {
    if (mode === "dark") {
      setMode("light");
    } else {
      setMode("dark");
    }
  };

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

  const _arr:
    | { _id: number; color: string; name: string }[]
    | undefined
    | null
    | any = info?.getMyExpenses.map((i) => i.tags);
  const mergedArrayOfTags: any[] = [].concat.apply([], _arr);
  const totalTagsName = mergedArrayOfTags.map((i) => i.name);
  const totalTagsColor = mergedArrayOfTags.map((i) => i.color);
  const tagNameResult = totalTagsName.reduce(function (prev, cur) {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {});
  const tagColorResult = totalTagsColor.reduce(function (prev, cur) {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {});

  ChartJS.register(ArcElement, Tooltip, Legend);

  const _data = {
    labels: Object.keys(tagNameResult),
    datasets: [
      {
        label: "# of Votes",
        data: Object.values(tagNameResult),
        backgroundColor: Object.keys(tagColorResult),
      },
    ],
  };

  const { error, loading } = useQuery(MAIN_QUERY, {
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

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar
          sx={{
            pr: "24px",
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 1,
            }}
          >
            <IconButton
              sx={{ ml: 1 }}
              onClick={toggleColorMode}
              color="inherit"
            >
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
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
      {location.pathname === "/dashboard" ? (
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
          <Box sx={{ p: { xs: "0 4rem 4rem", md: "0 14rem 14rem" } }}>
            <Pie data={_data} />
            <Typography
              variant="h6"
              gutterBottom
              fontFamily="system-ui"
              fontWeight="700"
              textAlign="center"
              mt={3}
            >
              Usage of each tag
            </Typography>
          </Box>
        </Box>
      ) : null}
      <Outlet />
    </>
  );
};

export default Dashboard;
