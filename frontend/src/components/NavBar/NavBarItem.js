import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsIcon from "@mui/icons-material/Notifications";
import VillaIcon from "@mui/icons-material/Villa";
import PaidIcon from "@mui/icons-material/Paid";
import BuildIcon from "@mui/icons-material/Build";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import EventIcon from "@mui/icons-material/Event";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import MapIcon from "@mui/icons-material/Map";
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import CalculateIcon from '@mui/icons-material/Calculate';
import CollectionsIcon from "@mui/icons-material/Collections";
import StyleIcon from "@mui/icons-material/Style";
import FunctionsIcon from "@mui/icons-material/Functions";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export const NavBarItems = [
  {
    id: 0,
    icon: <HomeIcon />,
    label: "Home",
    shortLabel: "Home",
    route: "/",
  },
  {
    id: 1,
    icon: <NotificationsIcon />,
    label: "Notifications",
    shortLabel: "Notifs",
    route: "notifications",
  },
  {
    id: 2,
    icon: <PeopleIcon />,
    label: "Teams",
    shortLabel: "Teams",
    route: "teams",
  },
  {
    id: 3,
    icon: <VillaIcon />,
    label: "Properties",
    shortLabel: "Properties",
    route: "properties",
  },
  {
    id: 4,
    icon: <MapIcon />,
    label: "Game Map",
    shortLabel: "Map",
    route: "map",
  },
  {
    id: 11,
    icon: <AutoGraphIcon />, //resource
    label: "ResourcesView",
    shortLabel: "ResView",
    route: "resourcesview",
  }
];

export const NPCItems = [
  {
    id: 5,
    icon: <PaidIcon />,
    label: "Add Money",
    shortLabel: "Money",
    route: "addmoney",
  },
  {
    id: 6,
    icon: <RequestQuoteIcon />,
    label: "Set Ownership",
    shortLabel: "Own",
    route: "setownership",
  },
  {
    id: 7,
    icon: <CurrencyExchangeIcon />,
    label: "Transfer",
    shortLabel: "Transfer",
    route: "transfer",
  },
  {
    id: 18,
    icon: <StyleIcon />,
    label: "Card",
    shortLabel: "Card",
    route: "card",
  },
  {
    id: 17,
    icon: <CollectionsIcon />,
    label: "Stage Display",
    shortLabel: "Display",
    route: "stage-display",
  },
  // {
  //   id: 14,
  //   icon: <QuizIcon />,
  //   label: "Random",
  //   shortLabel: "Random",
  //   route: "random",
  // },
  {
    id: 15,
    icon: <AutoGraphIcon />, //resource
    label: "Resources",
    shortLabel: "Resources",
    route: "resources",
  }
];

export const adminItems = [
  {
    id: 10,
    icon: <EventIcon />,
    label: "Event / Phase",
    shortLabel: "Event",
    route: "event",
  },
  {
    id: 12,
    icon: <BuildIcon />,
    label: "Team Info",
    shortLabel: "Team",
    route: "teams",
  },
  {
    id: 13,
    icon: <PaidIcon />,
    label: "Bankrupt",
    shortLabel: "Bankrupt",
    route: "bankrupt",
  },
  {
    id: 14,
    icon: <VolumeUpIcon />,
    label: "Broadcast",
    shortLabel: "Broadcast",
    route: "broadcast",
  },
  {
    id: 19,
    icon: <FunctionsIcon />,
    label: "Accounting",
    shortLabel: "Accounting",
    route: "accounting",
  },
  {
    id: 16,
    icon: <CalculateIcon />,
    label: "SetResources",
    shortLabel: "SetRes",
    route: "setresources",
  },
  {
    id: 20,
    icon: <TrendingUpIcon />,
    label: "Game Bonus",
    shortLabel: "Bonus",
    route: "gamebonus",
  }
];

// export const Navigate = (path) => {
//   const { setNavBarId } = useContext(RoleContext);
//   const navigate = useNavigate();

//   const itemMap = {
//     ...NavBarItems,
//     ...NPCItems,
//     ...adminItems,
//   };
//   setNavBarId(itemMap.find((item) => item.route === path).id);

//   return () => navigate(path);
// };
