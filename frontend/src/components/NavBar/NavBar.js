import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  SwipeableDrawer,
  Badge,
} from "@mui/material";
import { NavBarItems, NPCItems, adminItems } from "./NavBarItem";
import { NavBarStyles } from "./NavStyle";
import RoleContext from "../useRole";

const Navbar = ({ open }) => {
  // const [navBarId, setNavBarId] = useState(0);
  const { role, roleId, setNavBarId, unreadCount } = useContext(RoleContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const handleClick = (index, name) => {
    navigate(name);
    setNavBarId(index);
  };

  const isSelected = (route) => {
    if (route === "/") return pathname === "/";
    return pathname === `/${route}` || pathname.startsWith(`/${route}/`);
  };

  const mapping = (item) => (
    <ListItem
      button
      key={item.id}
      onClick={() => handleClick(item.id, item.route)}
      selected={isSelected(item.route)}
    >
      <ListItemIcon sx={NavBarStyles.icons}>
        {item.route === "notifications" ? (
          <Badge badgeContent={unreadCount} color="error" overlap="circular">
            {item.icon}
          </Badge>
        ) : (
          item.icon
        )}
      </ListItemIcon>
      <ListItemText sx={NavBarStyles.text} primary={item.label} />
    </ListItem>
  );

  return (
    <SwipeableDrawer
      sx={NavBarStyles.drawer}
      variant="temporary"
      anchor="left"
      open={open}
      onOpen={() => {}}
      onClose={() => {}}
    >
      <Toolbar align="center">{role}</Toolbar>
      <Divider />
      <List>
        {NavBarItems.map(mapping)}
        {roleId > 20 && (
          <>
            <Divider />
            <Typography sx={{ marginLeft: 3, marginTop: 2 }}>NPC</Typography>
            {NPCItems.map(mapping)}
          </>
        )}
        {roleId === 100 && (
          <>
            <Divider />
            <Typography sx={{ marginLeft: 3, marginTop: 2 }}>Admin</Typography>
            {adminItems.map(mapping)}
          </>
        )}
      </List>
    </SwipeableDrawer>
  );
};

export default Navbar;
