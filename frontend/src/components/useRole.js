import { createContext } from "react";

const RoleContext = createContext({
  navBarId: 0,
  setNavBarId: () => {},
  role: "",
  setRole: () => {},
  roleId: 0,
  setRoleId: () => {},
  teams: [],
  setTeams: () => {},
  resources: [],
  setResources: () => {},
  phase: 1,
  setPhase: () => {},
  buildings: [],
  setBuildings: () => {},
  filteredBuildings: [],
  setFilteredBuildings: () => {},
  unreadCount: 0,
  setUnreadCount: () => {},
});

export default RoleContext;
