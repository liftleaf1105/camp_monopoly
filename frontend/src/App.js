import React, { useState, useEffect } from "react";
import axios from "./components/axios";
import Header from "./components/Header";
import "./App.css";
import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { ThemeProvider } from "@mui/material/styles";
import Home from "./components/Home";
import Notifications from "./components/Notifications";
import Teams from "./components/Teams/Teams";
import Properties from "./components/Properties/Properties";
import SellProperty from "./components/Properties/SellProperty";
import Login from "./components/Login";
import AddMoney from "./components/NPC/AddMoney";
import SetOwnership from "./components/NPC/SetOwnership";
import Transfer from "./components/NPC/Transfer";
import SetShopLevel from "./components/NPC/SetShopLevel";
import Support from "./components/NPC/Support";
import Event from "./components/admin/Event";
import Resources from "./components/NPC/Resources";
import Additional from "./components/admin/Additional";
import SetOccupation from "./components/admin/SetOccupation";
import Accounting from "./components/admin/Accounting";
import Bankrupt from "./components/admin/Bankrupt";
import PermissionDenied from "./components/PermissionDenied";
import Footer from "./components/Footer";
import RoleContext from "./components/useRole";
import Loading from "./components/Loading";
import BroadcastAlert from "./components/BroadcastAlert";
import Broadcast from "./components/admin/Broadcast";
import { roleIdMap } from "./components/Login";
import theme from "./theme";
import SetDice from "./components/NPC/SetDice";
import Map from "./components/Properties/Map";
import Random from "./components/NPC/Random";
import Card from "./components/NPC/Card";
import SetResources from "./components/admin/SetResources";
import Help from "./components/Help";
import ResourcesView from "./components/Teams/ResourcesView";
import StageDisplay from "./components/StageDisplay";
import AccountingResult from "./components/admin/AccountingResult";
import GameBonus from "./components/admin/GameBonus";
// import SetPrices from "./components/admin/Resources";
// import Resource from "../../backend/models/resource";
// // import { socket, SocketContext } from "./websocket";

const App = () => {
  const localRole = localStorage.getItem("role");
  // console.log(localRole);
  const [navBarId, setNavBarId] = useState(0);
  const [role, setRole] = useState(localRole ? localRole : "");
  const [roleId, setRoleId] = useState(localRole ? roleIdMap[role] : 0);
  const [teams, setTeams] = useState([]);
  const [resources, setResources] = useState([]);
  const [phase, setPhase] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const value = {
    navBarId,
    setNavBarId,
    role,
    setRole,
    roleId,
    setRoleId,
    teams,
    setTeams,
    resources,
    setResources,
    phase,
    setPhase,
    buildings,
    setBuildings,
    filteredBuildings,
    setFilteredBuildings,
    unreadCount,
    setUnreadCount,
  };

  const location = useLocation();

  // On login (or refresh while logged in), only major events count as unread.
  // Regular popups still show live, but they should not light up the badge.
  useEffect(() => {
    if (role === "") {
      setUnreadCount(0);
      return;
    }
    const computeBaselineUnread = async () => {
      try {
        const lastSeen = Number(localStorage.getItem("notifLastSeen")) || 0;
        const { data: event } = await axios.get("/event");
        const eventCreatedAt = Number(event?.createdAt) || 0;
        setUnreadCount(event?.id > 0 && eventCreatedAt > lastSeen ? 1 : 0);
      } catch (e) {
        console.error("Failed to compute unread event notifications", e);
      }
    };
    computeBaselineUnread();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  return (
    // <SocketContext.Provider value={socket}>
    <ThemeProvider theme={theme}>
      <RoleContext.Provider value={value}>
        <Header />
        <BroadcastAlert />
        <TransitionGroup>
          <CSSTransition
            key={location.key}
            timeout={300}
            classNames="fade"
            unmountOnExit
            in={true}
            appear={true}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/help" element={<Help />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="teams" element={<Teams />} />
              <Route path="resourcesview" element={<ResourcesView />} />
              <Route path="stage-display" element={<StageDisplay />} />
              <Route path="properties" element={<Properties />} />
              <Route path="sellproperty" element={<SellProperty />} />
              <Route path="login" element={<Login />} />
              <Route path="addmoney" element={<AddMoney />} />
              <Route path="setownership" element={<SetOwnership />} />
              <Route path="transfer" element={<Transfer />} />
              <Route path="card" element={<Card />} />
              <Route path="setshop" element={<SetShopLevel />} />
              <Route path="random" element={<Random />} />
              <Route path="event" element={<Event />} />
              <Route path="resources" element={<Resources/>} />
              <Route path="additional" element={<Additional />} />
              <Route path="setoccupation" element={<SetOccupation />} />
              <Route path="permission" element={<PermissionDenied />} />
              <Route path="loading" element={<Loading />} />
              <Route path="accounting" element={<Accounting />} />
              <Route path="accounting-result" element={<AccountingResult />} />
              <Route path="bankrupt" element={<Bankrupt />} />
              <Route path="broadcast" element={<Broadcast />} />
              <Route path="setdice" element={<SetDice />} />
              <Route path="map" element={<Map />} />
              <Route path="setresources" element={<SetResources />} />
              <Route path="gamebonus" element={<GameBonus />} />
            </Routes>
          </CSSTransition>
        </TransitionGroup>
        <Footer />
      </RoleContext.Provider>
    </ThemeProvider>
    // </SocketContext.Provider>
  );
};

const Root = () => <BrowserRouter><App /></BrowserRouter>; // prettier-ignore

export default Root;
