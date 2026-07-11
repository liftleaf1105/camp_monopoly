import Team from "../models/team.js";

const shouldIncrementBankruptcy = (beforeMoney, afterMoney) =>
  Number(beforeMoney) >= 0 && Number(afterMoney) < 0;

export const setTeamMoney = async (teamOrId, nextMoney) => {
  const team =
    typeof teamOrId === "object" && teamOrId !== null
      ? teamOrId
      : await Team.findOne({ id: teamOrId });

  if (!team) return null;

  const beforeMoney = Number(team.money || 0);
  const afterMoney = Math.round(Number(nextMoney));

  team.money = afterMoney;
  if (shouldIncrementBankruptcy(beforeMoney, afterMoney)) {
    team.bankruptcyCount = Number(team.bankruptcyCount || 0) + 1;
  }

  await team.save();
  return team;
};

export const addTeamMoney = async (teamOrId, delta) => {
  const team =
    typeof teamOrId === "object" && teamOrId !== null
      ? teamOrId
      : await Team.findOne({ id: teamOrId });

  if (!team) return null;
  return setTeamMoney(team, Number(team.money || 0) + Number(delta));
};
