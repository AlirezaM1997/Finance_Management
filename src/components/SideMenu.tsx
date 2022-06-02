import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { ExitToApp, LabelRounded } from "@mui/icons-material";
import Cookies from "universal-cookie";
import { useAllState } from "../Provider";
import { Link } from "react-router-dom";

export const MainListItems = () => {
  return (
    <React.Fragment>
      <Link to={"/dashboard"}>
        <ListItemButton>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </Link>
      <Link to={"/dashboard/expenses"}>
        <ListItemButton>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Expenses" />
        </ListItemButton>
      </Link>
      <Link to={"/dashboard/createtags"}>
        <ListItemButton>
          <ListItemIcon>
            <LabelRounded />
          </ListItemIcon>
          <ListItemText primary="Create Tags" />
        </ListItemButton>
      </Link>
      <Link to={'/dashboard/reports'}>
        <ListItemButton>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItemButton>
      </Link>
    </React.Fragment>
  );
};

export const SecondaryListItems = () => {
  const cookies = new Cookies();
  const { setToken } = useAllState();
  const logOut = () => {
    cookies.remove("token");
    setToken("");
    window.location.href = "/";
  };
  return (
    <React.Fragment>
      <ListItemButton onClick={logOut}>
        <ListItemIcon>
          <ExitToApp style={{ transform: "rotate(180deg)" }} />
        </ListItemIcon>
        <ListItemText primary="Log Out" />
      </ListItemButton>
    </React.Fragment>
  );
};
