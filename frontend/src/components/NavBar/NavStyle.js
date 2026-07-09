export const NavBarStyles = {
  drawer: {
    width: 250,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: 190,
      boxSizing: "border-box",
      backgroundColor: "#4B4037",
      color: "rgba(255, 255, 255, 0.7)",
    },
    "& .Mui-selected": {
      color: "#C98345",
    },
  },
  icons: {
    color: "rgba(255, 255, 255, 0.7)!important",
    marginLeft: "5px",
  },
  text: {
    "& span": {
      marginLeft: "-20px",
      fontWeight: "200",
      fontSize: "15px",
    },
  },
};
