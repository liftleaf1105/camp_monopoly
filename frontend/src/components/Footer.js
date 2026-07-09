import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NPCItems, NavBarItems, adminItems } from "./NavBar/NavBarItem";
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Badge,
} from "@mui/material";
import RoleContext from "./useRole";

const Footer = () => {
  const { role, unreadCount } = useContext(RoleContext);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const matchIndex = items.findIndex((item) =>
    item.route === "/"
      ? pathname === "/"
      : pathname === `/${item.route}` || pathname.startsWith(`/${item.route}/`)
  );
  const value = matchIndex === -1 ? false : matchIndex;

  useEffect(() => {
    if (role === "admin") {
      setItems(adminItems);
    } else if (role === "NPC") {
      setItems(NPCItems);
    } else {
      setItems(NavBarItems);
    }
  }, [role]);

  const withBadge = (item) =>
    item.route === "notifications" ? (
      <Badge badgeContent={unreadCount} color="error" overlap="circular">
        {item.icon}
      </Badge>
    ) : (
      item.icon
    );

  const mapping = (item) => (
    <BottomNavigationAction
      key={item.id}
      label={item.shortLabel}
      icon={withBadge(item)}
    />
  );

  return (
    <AppBar
      position="fixed"
      sx={{ top: "auto", bottom: 0 }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          if (newValue < items.length) navigate(items[newValue].route);
        }}
      >
        {items.map(mapping)}
      </BottomNavigation>
    </AppBar>
  );
};

export default Footer;
