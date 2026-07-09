import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NPCItems, NavBarItems, adminItems } from "./NavBar/NavBarItem";
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PeopleIcon from "@mui/icons-material/People";
import RoleContext from "./useRole";

const Footer = () => {
  const { role, unreadCount } = useContext(RoleContext);
  const [items, setItems] = useState([]);
  const [menu, setMenu] = useState(null); // { anchorEl, items }
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAdmin = role === "admin";

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

  const openMenu = (event, menuItems) => {
    setMenu({ anchorEl: event.currentTarget, items: menuItems });
  };
  const closeMenu = () => setMenu(null);
  const handleMenuNavigate = (route) => {
    navigate(route);
    closeMenu();
  };

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
      sx={{ top: "auto", bottom: 0, display: { xs: "none", md: "block" } }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          if (newValue < items.length) navigate(items[newValue].route);
        }}
      >
        {items.map(mapping)}
        {isAdmin && (
          <BottomNavigationAction
            label="NPC"
            icon={<EngineeringIcon />}
            onClick={(e) => openMenu(e, NPCItems)}
          />
        )}
        {isAdmin && (
          <BottomNavigationAction
            label="Team"
            icon={<PeopleIcon />}
            onClick={(e) => openMenu(e, NavBarItems)}
          />
        )}
      </BottomNavigation>

      <Menu
        anchorEl={menu?.anchorEl}
        open={Boolean(menu)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {menu?.items.map((item) => (
          <MenuItem
            key={item.id}
            onClick={() => handleMenuNavigate(item.route)}
          >
            <ListItemIcon>{withBadge(item)}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
};

export default Footer;
