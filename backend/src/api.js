import express from "express";
import Team from "../models/team.js";
import Land from "../models/land.js";
import User from "../models/user.js";
import Notification from "../models/notification.js";
import Event from "../models/event.js";
import Pair from "../models/pair.js";
import Effect from "../models/effect.js";
import Broadcast from "../models/broadcast.js";
import Resource from "../models/resource.js";
const router = express.Router();

const SERIES_BONUS_GROUPS = [
  [2, 3, 4],
  [6, 7, 8],
  [14, 15, 16],
  [18, 19, 20],
  [26, 27, 28],
  [34, 35, 36],
  [39, 40, 41],
];

const SERIES_BONUS_MULTIPLIERS = [1, 1.25, 1.5];

const getBaseRent = (land) => {
  const buyPrice = land.price && land.price.buy;
  if (!buyPrice) return land.rent;
  return [0.2, 0.4, 1].map((multiplier) =>
    Math.round(buyPrice * multiplier)
  );
};

const getSeriesBonusGroup = (landId) =>
  SERIES_BONUS_GROUPS.find((group) => group.includes(landId));

const getSeriesBonusLevel = (groupLands, land) => {
  if (land.owner === 0) return 0;
  const sameOwnerCount = groupLands.filter(
    (groupLand) => groupLand.owner === land.owner
  ).length;
  if (sameOwnerCount === 3) return 2;
  if (sameOwnerCount === 2) return 1;
  return 0;
};

const recalculateSeriesBonus = async (groupIds) => {
  const groupLands = await Land.find({ id: { $in: groupIds } }).sort({ id: 1 });
  if (groupLands.length !== groupIds.length) {
    throw new Error(`Series bonus group is incomplete: ${groupIds.join(",")}`);
  }

  await Promise.all(
    groupLands.map(async (land) => {
      const bonusLevel = getSeriesBonusLevel(groupLands, land);
      const multiplier = SERIES_BONUS_MULTIPLIERS[bonusLevel];
      land.buffed = bonusLevel;
      land.rent = getBaseRent(land).map((rent) =>
        Math.round(rent * multiplier)
      );
      await land.save();
    })
  );
};

router.get("/", (req, res) => {
  res.json({ a: 1, b: 2 });
});

// const requireAdmin = (req, res, next) => {
//   if (!req.session.user) {
//     res.status(401).json({ error: "Unauthorized" });
//     return;
//   }
//   if (req.session.user.username !== "admin") {
//     res.status(403).json({ error: "Forbidden" });
//     return;
//   }
//   next();
// };

// const requireNPC = (req, res, next) => {
//   if (!req.session.user) {
//     res.status(401).json({ error: "Unauthorized" });
//     return;
//   }
//   next();
// };

// async function calcmoney(teamname, money, estate) {
//   const team = await Team.findOne({ teamname });
//   if (money > 0) {
//     if (team.soulgem.value) {
//       money *= 2;
//     }
//     if (estate) {
//       money *= team.bonus.value;
//     }
//   } else {
//     if (team.soulgem.value) {
//       money *= 1.5;
//     }
//   }
//   return money;
// }

async function updateTeam(team, moneyChanged, io, saved) {
  const teamObj = await Team.findOne({ id: team });
  var ratio = 1;
  if (teamObj.soulgem.value === true) {
    if (moneyChanged > 0) ratio = 2;
    else ratio = 1.5;
  }
  let final = Math.round(teamObj.money + moneyChanged * ratio);
  if (saved && teamObj.money >= 0 && final < 0) {
    const message = {
      title: "破產!!!",
      description: teamObj.teamname,
      level: 0,
      createdAt: Date.now(),
    };
    await new Broadcast(message).save();
    io.emit("broadcast", message);
  }
  if (saved) {
    const temp = await Team.findOneAndUpdate(
      { id: team },
      { money: final },
      { new: true } //return the item after update
    );
    return temp;
  } else {
    return { money: final };
  }
}

const cardNames = {
  Cooz: "我的褲子裡有松鼠",
  Hey: "黑道小弟",
  Ayi: "阿姨我不想努力了",
  GeGon: "擱供",
  Jeff: "劫富濟貧",
  Ala: "阿拉花瓜",
};

const toId = (value) => parseInt(value, 10);

const emitCardNotice = (io, targetTeamId, ownerId, cardName, message) => {
  io.emit("broadcast", {
    title: "卡片發動",
    description: `第${ownerId}小隊發動了${cardName}，${message}`,
    targetTeamId,
  });
};

const updateTeamMoneyDirectly = async (teamId, delta) => {
  const team = await Team.findAndCheckValid(teamId);
  if (!team) return null;
  team.money = Math.round(team.money + delta);
  await team.save();
  return team;
};

const calcTotalAsset = (team, resourcePrices) => {
  const lovePrice = resourcePrices.find((resource) => resource.id === 0)?.price || 0;
  const eecoinPrice =
    resourcePrices.find((resource) => resource.id === 1)?.price || 0;
  return (
    Math.round(team.money) +
    (team.resources?.love || 0) * lovePrice +
    (team.resources?.eecoin || 0) * eecoinPrice
  );
};

const getRichestTeamByTotalAsset = async (excludedTeamIds = []) => {
  const teams = await Team.find({ id: { $nin: excludedTeamIds } });
  const resourcePrices = await Resource.find().sort({ id: 1 });
  return teams.sort((a, b) => {
    return calcTotalAsset(b, resourcePrices) - calcTotalAsset(a, resourcePrices);
  })[0];
};

const getPoorestTeams = async (count, excludedTeamIds = []) => {
  return Team.find({ id: { $nin: excludedTeamIds } })
    .sort({ money: 1 })
    .limit(count);
};

const getPoorestTeamsByMoneyWithTies = async (count) => {
  const teams = await Team.find().sort({ money: 1, id: 1 });
  const selected = [];
  let index = 0;

  while (index < teams.length && selected.length < count) {
    const money = teams[index].money;
    const tiedTeams = teams.filter((team) => team.money === money);
    selected.push(...tiedTeams);
    index += tiedTeams.length;
  }

  return selected;
};

const getRichestTeamsByTotalAsset = async () => {
  const teams = await Team.find().sort({ id: 1 });
  const resourcePrices = await Resource.find().sort({ id: 1 });
  const teamsWithAssets = teams.map((team) => ({
    team,
    totalAsset: calcTotalAsset(team, resourcePrices),
  }));
  const maxAsset = Math.max(
    ...teamsWithAssets.map(({ totalAsset }) => totalAsset)
  );

  return teamsWithAssets
    .filter(({ totalAsset }) => totalAsset === maxAsset)
    .map(({ team }) => team);
};

const calcBaseRent = async (land) => {
  if (!land || land.owner === 0) return 0;
  if (land.type === "Building") {
    if (land.level <= 0) return 0;
    return land.rent[land.level - 1];
  }
  const count = await Land.countDocuments({ area: land.area, owner: land.owner });
  return count * 5000;
};

const buildMoneyChange = (team, delta, role) => {
  const normalizedDelta = Number(delta);
  const before = Math.round(team.money);
  return {
    team,
    role,
    before,
    delta: normalizedDelta,
    after: before + normalizedDelta,
  };
};

const buildMoneyChanges = (changes) => {
  const changesByTeam = new Map();

  changes.forEach(({ team, delta, role }) => {
    const current = changesByTeam.get(team.id);
    if (current) {
      current.delta += delta;
    } else {
      changesByTeam.set(team.id, { team, delta, role });
    }
  });

  return Array.from(changesByTeam.values()).map(({ team, delta, role }) =>
    buildMoneyChange(team, delta, role)
  );
};

const buildCardPreview = async ({ card, owner, target, amount, building }) => {
  const cardName = cardNames[card];
  const ownerId = toId(owner);
  const targetId = toId(target);
  const buildingId = toId(building);
  const requestedAmount = toId(amount);
  const ownerTeam = await Team.findAndCheckValid(ownerId);

  if (!cardName) return { error: "Unknown card" };
  if (!ownerTeam) return { error: "Owner not found" };

  if (card === "Cooz") {
    const targets = await getPoorestTeamsByMoneyWithTies(2);
    const total = Math.floor(ownerTeam.money / 4);
    const share = Math.floor(total / targets.length);
    return {
      card,
      cardName,
      owner: ownerTeam,
      amount: total,
      transfers: targets.map((team) => ({
        target: team,
        amount: share,
      })),
      moneyChanges: buildMoneyChanges([
        { team: ownerTeam, delta: -total, role: "owner" },
        ...targets.map((team) => ({ team, delta: share, role: "target" })),
      ]),
    };
  }

  if (card === "Hey") {
    const targetTeam = await Team.findAndCheckValid(targetId);
    if (!targetTeam) return { error: "Target not found" };
    if (ownerId === targetId) return { error: "Owner and Target cannot be the same" };
    return {
      card,
      cardName,
      owner: ownerTeam,
      target: targetTeam,
      amount: 2000,
      moneyChanges: [
        buildMoneyChange(ownerTeam, 2000, "owner"),
        buildMoneyChange(targetTeam, -2000, "target"),
      ],
    };
  }

  if (card === "Ayi") {
    const targetTeam = await Team.findAndCheckValid(targetId);
    if (!targetTeam) return { error: "Target not found" };
    if (ownerId === targetId) return { error: "Owner and Target cannot be the same" };
    if (!requestedAmount || requestedAmount <= 0)
      return { error: "Amount must be greater than 0" };
    return {
      card,
      cardName,
      owner: ownerTeam,
      target: targetTeam,
      amount: requestedAmount,
      moneyChanges: buildMoneyChanges([
        { team: targetTeam, delta: -requestedAmount, role: "target" },
      ]),
    };
  }

  if (card === "GeGon") {
    const land = await Land.findOne({ id: buildingId });
    if (!land) return { error: "Building not found" };
    const targetTeam = await Team.findAndCheckValid(land.owner);
    if (!targetTeam) return { error: "Building has no owner" };
    if (ownerId === targetTeam.id)
      return { error: "Owner and Target cannot be the same" };
    const rent = await calcBaseRent(land);
    if (rent <= 0) return { error: "Building has no rent" };
    return {
      card,
      cardName,
      owner: ownerTeam,
      target: targetTeam,
      building: land,
      amount: Math.round(rent * 0.5),
      rent,
      moneyChanges: [
        buildMoneyChange(ownerTeam, Math.round(rent * 0.5), "owner"),
        buildMoneyChange(targetTeam, -Math.round(rent * 0.5), "target"),
      ],
    };
  }

  if (card === "Jeff") {
    const targetTeams = await getRichestTeamsByTotalAsset();
    if (targetTeams.length === 0) return { error: "Target not found" };
    const splitCount = targetTeams.length;
    const payments = targetTeams.map((team) => ({
      team,
      amount: Math.floor(Math.floor(team.money / 4) / splitCount),
    }));
    const cardAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    return {
      card,
      cardName,
      owner: ownerTeam,
      targets: targetTeams,
      amount: cardAmount,
      moneyChanges: buildMoneyChanges([
        { team: ownerTeam, delta: cardAmount, role: "owner" },
        ...payments.map(({ team, amount }) => ({
          team,
          delta: -amount,
          role: "target",
        })),
      ]),
    };
  }

  if (card === "Ala") {
    const land = await Land.findOne({ id: buildingId });
    if (!land) return { error: "Building not found" };
    const targetTeam = await Team.findAndCheckValid(land.owner);
    if (!targetTeam) return { error: "Building has no owner" };
    if (ownerId === targetTeam.id)
      return { error: "Owner and Target cannot be the same" };
    if (land.level <= 1) return { error: "Building has no house" };
    return {
      card,
      cardName,
      owner: ownerTeam,
      target: targetTeam,
      building: land,
      amount: 0,
      newLevel: land.level - 1,
      propertyChange: {
        building: land,
        owner: targetTeam,
        beforeLevel: land.level,
        afterLevel: land.level - 1,
      },
    };
  }

  return { error: "Unsupported card" };
};

async function deleteTimeoutNotification() {
  const notifications = await Notification.find();
  const time = Date.now() / 1000;
  for (let i = 0; i < notifications.length; i++) {
    if (
      notifications[i].createdAt + notifications[i].duration < time &&
      notifications[i].duration > 0
    ) {
      await Notification.findByIdAndDelete(notifications[i]._id);
    }
  }
}

// router
//   .get("/phase", async (req, res) => {
//     const phase = await Pair.findOne({ key: "phase" });
//     res.json({ phase: phase.value }).status(200);
//   })
//   .post("/phase", async (req, res) => {
//     const phase = await Pair.findOne({ key: "phase" });
//     phase.value = req.body.phase;
//     await phase.save();
//     res.json({ phase: phase.value }).status(200);
//     req.io.emit("broadcast", {
//       title: `Phase Changed to ${phase.value}`,
//       description: "",
//       level: 0,
//     });
//   });

router.get("/team", async (req, res) => {
  const teams = await Team.find().sort({ teamname: 1 });
  res.json(teams).status(200);
});

router.get("/teamRich", async (req, res) => {
  const teams = await Team.find().sort({ money: -1 });
  const team = teams[0];
  console.log(team);
  res.json(team).status(200);
});

router.post("/checkPropertyCost", async (req, res) => {
  const { team, building, mode } = req.body;

  const targetBuilding = await Land.find({ id: building });
  const targetTeam = await Team.find({ id: team });
  const surplus = targetTeam[0].money;
  if (mode === "Buy") {
    const checkPropertyCost = targetBuilding[0].price.buy;
    if (surplus >= checkPropertyCost) res.json({ message: "OK" }).status(200);
    else {
      res.json({ message: "FUCK" }).status(200);
    }
  } else if (mode === "Upgrade") {
    const checkPropertyCost = targetBuilding[0].price.upgrade;
    console.log(checkPropertyCost);
    if (surplus >= checkPropertyCost) res.json({ message: "OK" }).status(200);
    else res.json({ message: "FUCK" }).status(200);
  }
});

router.get("/team/:teamId", async (req, res) => {
  const team = await Team.findOne({ id: req.params.teamId });
  res.json(team).status(200);
});

router.get("/land", async (req, res) => {
  const lands = await Land.find().sort({ id: 1 });
  res.json(lands).status(200);
});

router.get("/land/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid land id" });
    return;
  }
  const land = await Land.findOne({ id });
  res.json(land).status(200);
});

router.get("/property/:teamId", async (req, res) => {
  const properties = await Land.find({ owner: req.params.teamId });
  res.json(properties).status(200);
});

router.post("/set", async (req, res) => {
  const { id, amount } = req.body;
  await Team.findOneAndUpdate({ id: parseInt(id) }, { money: amount });
  res.json({ success: true }).status(200);
});

router.get("/getRent", async (req, res) => {
  const building = req.query.building;
  if (building !== -1) {
    const targetBuilding = await Land.find({ id: building });
    const rent = targetBuilding[0].rent[targetBuilding[0].level - 1];
    res.json(rent).status(200);
  }
  res.json(0).status(200);
});

// router.get("/resourceInfo", async (req, res) => {
//   const resources = await Resource.find().sort({ id: 1 });
//   res.json(resources).status(200);
// });

router.get('/resourceInfo', async (req, res) => {
  const resources = await Resource.find().sort({ id: 1 });
  res.json(resources).status(200);
});

router.get("/resourceName", async (req, res) => {
  try {
    const resources = await Resource.find();
    const resourcesName = resources.map(resource => resource.name);
    res.json(resourcesName);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/resourcePrice", async (req, res) => {
  try {
    const resources = await Resource.find().sort({ id: 1 });
    const resourcesPrice = resources.map(resource => resource.price);
    res.json(resourcesPrice);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/controlResource", async (req, res) => {
  const { teamId, resourceId, number, mode } = req.body;
  const team = await Team.collection.findOne({ id: teamId });
  const amount = Number(number);
  const controlMode = Number(mode);

  if (controlMode === 0) {//-
    if(resourceId == 0){ //love
      if (team.resources.love < amount) {
        return res.status(400).json({ message: "Not enough resources" });
      }

      await Team.findOneAndUpdate(
        { id: teamId },
        { 
          resources: { love : team.resources.love - amount, eecoin : team.resources.eecoin },
        }
      );
    }else if(resourceId == 1){ //eecoin
      if (team.resources.eecoin < amount) {
        return res.status(400).json({ message: "Not enough resources" });
      }

      await Team.findOneAndUpdate(
        { id: teamId },
        {
          resources: {love : team.resources.love, eecoin : team.resources.eecoin - amount},
        }
      );
    }
  } else if (controlMode === 1) {//+
    if(resourceId == 0){
      await Team.findOneAndUpdate(//love
        { id: teamId },
        {
          resources: { love: team.resources.love + amount, eecoin: team.resources.eecoin },
        }
      );
    }else if(resourceId == 1){//eecoin
      await Team.findOneAndUpdate(
        { id: teamId },
        {
          resources: { love: team.resources.love, eecoin: team.resources.eecoin + amount },
        }
      );
    }
  }
  
  res.status(200).json("Success");
});

router.post("/updateResourcePrice", async (req, res) => {
  const {resourceId, price} = req.body;

  await Resource.findOneAndUpdate(
    { id: resourceId },
    { 
      price : price
    }
  );

  res.json("Success").status(200);
});


router.post("/sellResource", async (req, res) => {
  const { teamId, resourceId, number, mode } = req.body;
  const team = await Team.collection.findOne({ id: teamId });
  const resource = await Resource.collection.findOne({ id: resourceId });

  if (mode === 0) {//sell
    if(resourceId == 0){ //love
      await Team.findOneAndUpdate(
        { id: teamId },
        { 
          resources: { love : team.resources.love - number, eecoin : team.resources.eecoin },
          money: team.money + resource.price * number
        }
      );
    }else if(resourceId == 1){ //eecoin
      await Team.findOneAndUpdate(
        { id: teamId },
        {
          resources: {love : team.resources.love, eecoin : team.resources.eecoin - number},
          money: team.money + resource.price * number
        }
      );
    }
  } else if (mode === 1) {//buy
    if(resourceId == 0){
      await Team.findOneAndUpdate(//love
        { id: teamId },
        {
          resources: { love: Number(team.resources.love) + Number(number), eecoin: team.resources.eecoin },
          money: team.money - resource.price * number,
        }
      );
    }else if(resourceId == 1){//eecoin
      await Team.findOneAndUpdate(
        { id: teamId },
        {
          resources: { love: team.resources.love, eecoin: Number(team.resources.eecoin) + Number(number) },
          money: team.money - resource.price * number,
        }
      );
    }
  }
  
  res.json("Success").status(200);
});

router.post("/percent", async (req, res) => {
  try {
    // Fetch all teams
    const teams = await Team.find();

    // Update each team's money by reducing it by 30%
    teams.forEach(async (team) => {
      team.money = team.money * 0.7; // Reduce money by 30%
      await team.save(); // Save the updated team
    });

    res.status(200).json({ message: "Money reduced by 30% for all teams" });
  } catch (err) {
    console.error("Error reducing money:", err);
    res.status(500).json({ message: "Failed to reduce money for teams" });
  }
});

router.post("/cutResource", async (req, res) => {
  console.log("hello");
  try {
    // Fetch all teams
    const teams = await Team.find();

    // Update each team's money by reducing it by 30%
    teams.forEach(async (team) => {
      console.log(team.resources.eecoin);
      team.resources.eecoin = math.round(team.resources.eecoin * 0.5); 
      team.resources.love = math.round(team.resources.love * 0.5); 
      await team.save(); // Save the updated team
    });

    res.status(200).json({ message: "Resources reduced by 50% for all teams" });
  } catch (err) {
    console.error("Error reducing resources:", err);
    res.status(500).json({ message: "Failed to reduce resource for teams" });
  }
});


router.post("/sell", async (req, res) => {
  const { teamId, landId, forced } = req.body;
  const land = await Land.findOne({ id: landId });
  if (land.owner !== teamId && teamId < 10) {
    res.status(400).json({ error: "Not your land" });
    return;
  }
  const team = await Team.findOne({ id: land.owner });

  const price = calcSellPrice(land, forced);
  // team.money += price;
  // await team.save();
  await updateTeam(land.owner, price, req.io, true);
  await Land.findOneAndUpdate({ id: landId }, { owner: 0, level: 0 });
  res.status(200).json({ message: "Sell successful" });
});

const eventDefinitions = [
  {
    id: 1,
    title: "海盜搶劫",
    description: "海盜搶劫，各組金錢資源減少30%",
  },
  {
    id: 2,
    title: "獵巫行動",
    description: "獄卒氣憤不已，隨機抽取3支隊伍前往監獄代罪",
  },
  {
    id: 3,
    title: "大航海時代",
    description: "大航海時代提升經濟，EE幣大漲",
  },
  {
    id: 4,
    title: "法國大革命",
    description: "因為革命，EE幣暴跌",
  },
  {
    id: 5,
    title: "男同俱樂部",
    description: "男隊輔被發現剽竊畫作，需要小隊員前往監獄贖人",
  },
  {
    id: 6,
    title: "黑死病",
    description: "各組消耗大量資源對付疾病，各組所有資源減少40%(四捨五入)",
  },
  {
    id: 7,
    title: "十字軍東征",
    description:
      "十字軍東征，各組同時前進15格(下一輪)，同時EE幣流通性提升，價格大漲",
  },
  {
    id: 8,
    title: "魔法失效",
    description: "遊戲結束前無法使用卡片效果，同時EE幣又暴跌",
  },
];

const emptyEvent = {
  id: 0,
  title: "無",
  description: "",
  note: "",
  createdAt: 0,
};

router.get("/allEvents", async (req, res) => {
  res.json([emptyEvent, ...eventDefinitions]).status(200);
});

router.post("/reset", async(req, res) =>{
  console.log("RESET");

  try {
    // Use updateMany + $set so only the reset fields are cast/validated.
    // This avoids re-validating unrelated legacy fields (e.g. a malformed
    // price.upgrade) that would make a full-document .save() throw.
    await Team.updateMany(
      {},
      {
        $set: { money: 40000, "resources.eecoin": 0, "resources.love": 0 },
        $unset: { bank: "", deposit: "" },
      }
    );
    await Resource.updateMany({}, { $set: { price: 10000 } });
    await Land.updateMany({}, { $set: { owner: 0, level: 0 } });

    res.json("Success").status(200);
  } catch (err) {
    console.error("Error resetting:", err);
    res.status(500).json({ message: "Failed to reset" });
  }
})

const getEventDefinition = (id) =>
  eventDefinitions.find((event) => event.id === id);

const eventResourcePrices = {
  1: { love: 9000, eecoin: 12000 },
  2: { love: 10000, eecoin: 15000 },
  3: { love: 11000, eecoin: 30000 },
  4: { love: 12000, eecoin: 1000 },
  5: { love: 8000, eecoin: 5000 },
  6: { love: 10500, eecoin: 2000 },
  7: { love: 9000, eecoin: 15000 },
  8: { love: 10000, eecoin: 100 },
};

const updateResourcePrices = async (prices) => {
  await Resource.findOneAndUpdate({ id: 0 }, { price: prices.love });
  await Resource.findOneAndUpdate({ id: 1 }, { price: prices.eecoin });
};

router
  .post("/event", async (req, res) => {
    try {
      const id = Number(req.body.id);
      const { targetTeamIds = [] } = req.body;
      const pair = await Pair.findOne({ key: "currentEvent" });
      const eventDefinition = getEventDefinition(id);
      const eventRecord = await Event.findOne({ id });

      if (!pair || !eventDefinition || !eventResourcePrices[id]) {
        res.status(400).json("Failed");
        return;
      }

      let note = "";

      switch (id) {
        case 1: {
          const teams = await Team.find();
          for (let i = 0; i < teams.length; i++) {
            teams[i].money = Math.round(teams[i].money * 0.7);
            await teams[i].save();
          }
          break;
        }
        case 2: {
          const selectedTeams = targetTeamIds.map((teamId) => Number(teamId));
          const uniqueTeams = new Set(selectedTeams);

          if (
            selectedTeams.length !== 3 ||
            uniqueTeams.size !== 3 ||
            selectedTeams.some(
              (teamId) =>
                !Number.isInteger(teamId) || teamId < 1 || teamId > 10
            )
          ) {
            res.status(400).json("Please select three different teams");
            return;
          }

          note = `${selectedTeams
            .map((teamId) => String(teamId).padStart(2, "0"))
            .map((teamId) => `第${teamId}小隊`)
            .join("、")}前往監獄`;

          break;
        }
        case 6: {
          const teams = await Team.find();
          for (let i = 0; i < teams.length; i++) {
            teams[i].resources.eecoin = Math.round(
              teams[i].resources.eecoin * 0.6
            );
            teams[i].resources.love = Math.round(teams[i].resources.love * 0.6);
            await teams[i].save();
          }
          break;
        }
        default:
          break;
      }

      await updateResourcePrices(eventResourcePrices[id]);

      pair.value = id;
      await pair.save();

      const createdAt = Date.now();

      if (eventRecord) {
        eventRecord.note = note;
        eventRecord.createdAt = createdAt;
        await eventRecord.save();
      }

      const eventAnnouncement = {
        title: eventDefinition.title,
        description: eventDefinition.description,
        note,
        level: 0,
        fullscreen: true,
        createdAt,
      };

      req.io.emit("broadcast", eventAnnouncement);
      res.status(200).json("Success");
      console.log("broadcast");
    } catch (err) {
      console.error("Error publishing event:", err);
      res.status(500).json("Failed");
    }
  })
  .get("/event", async (req, res) => {
    const pair = await Pair.findOne({ key: "currentEvent" });
    if (!pair) {
      res.status(200).json(emptyEvent);
      return;
    }

    const id = Number(pair.value);
    const eventRecord = await Event.findOne({ id });
    const eventDefinition = getEventDefinition(id);

    if (!eventDefinition) {
      res.json(eventRecord || emptyEvent).status(200);
      return;
    }

    res
      .json({
        ...eventDefinition,
        note: eventRecord ? eventRecord.note : "",
        createdAt: eventRecord ? eventRecord.createdAt || 0 : 0,
      })
      .status(200);
  });

// router.post("/occupation", async (req, res) => {
//   const { teamname, occupation } = req.body;
//   const team = await Team.findOne({ teamname });
//   team.occupation = occupation;
//   await team.save();

//   if (occupation === "鷹眼") {
//     const pair = await Pair.findOneAndUpdate(
//       { key: "hawkEyeTeam" },
//       { value: team.id }
//     );
//   }
//   res.json(team).status(200);
// });

// router.post("/level", async (req, res) => {
//   const { teamId, level } = req.body;
//   const team = await Team.findOneAndUpdate({ id: teamId }, { level: level });
//   console.log(team);
//   res.json(team).status(200);
// });

router.post("/tape", async (req, res) => {
  const teams = await Team.find();
  for (let i = 0; i < teams.length; i++) {
    teams[i].money -= 5000;
    await teams[i].save();
  }
  req.io.emit("broadcast", {
    title: "紙膠帶發動",
    description: "紙膠帶狂暴黑料!所有小隊遭扣除5000元",
  });
  res.json("Success").status(200);
});

router.post("/goldenFruit", async (req, res) => {
  const { building } = req.body;
  const land = await Land.find({ id: building });
  const level = land[0].level;
  const targetTeam = await Team.find({ id: land[0].owner });
  targetTeam[0].money +=
    Math.round(
      (land[0].price.buy + (land[0].level - 1) * land[0].price.upgrade) * 0.07
    ) * 10;

  land[0].owner = 0;
  land[0].level = 0;
  targetTeam[0].save();
  land[0].save();
  req.io.emit("broadcast", {
    title: "金蔓莓果發動",
    description: `${targetTeam[0].teamname}被使用了金蔓莓果！`,
  });
  res.json({ land, level }).status(200);
});

router
  .post("/add", async (req, res) => {
    const { id, dollar, jeff, jeffTeam } = req.body;
    const team = await Team.findAndCheckValid(id);
    const targetTeam = await Team.find({ id: jeffTeam });
    if (!team) {
      res.status(403).send();
      console.log("Team not found");
      return;
    }

    if (jeff) {
      req.io.emit("broadcast", {
        title: "劫富卡發動",
        description: `第${jeffTeam}小隊遭到劫富！！`,
      });
      await Team.findOneAndUpdate(
        { id: jeffTeam },
        { money: targetTeam[0].money * 0.75 }
      );
    }

    await updateTeam(id, dollar, req.io, true);
    // if (dollar < 0) {
    //   req.io.emit("broadcast", {
    //     title: "扣錢",
    //     description: `第${id}小隊遭扣除${-dollar}元！！`,
    //   });
    // }

    res.status(200).send("Update succeeded");
  })
  .get("/add", async (req, res) => {
    console.log(req.query);
    const { id, dollar } = req.query;
    console.log(id, dollar);
    const data = await updateTeam(id, dollar, req.io, false);
    console.log(data);
    res.json(data).status(200);
  });

router.post("/card/preview", async (req, res) => {
  const preview = await buildCardPreview(req.body);
  if (preview.error) {
    res.status(400).json(preview);
    return;
  }
  res.json(preview).status(200);
});

router.post("/card", async (req, res) => {
  const preview = await buildCardPreview(req.body);
  if (preview.error) {
    res.status(400).json(preview);
    return;
  }

  const { card, cardName, owner, target, building, newLevel, moneyChanges } =
    preview;
  const ownerId = owner.id;

  if (card === "Ala") {
    const land = await Land.findOne({ id: building.id });
    land.level = newLevel;
    await land.save();
    emitCardNotice(
      req.io,
      target.id,
      ownerId,
      cardName,
      `你的${building.name}房子被拆掉一級`
    );
  } else {
    for (let i = 0; i < moneyChanges.length; i++) {
      const change = moneyChanges[i];
      if (change.delta === 0) continue;
      await updateTeamMoneyDirectly(change.team.id, change.delta);
      emitCardNotice(
        req.io,
        change.team.id,
        ownerId,
        cardName,
        change.delta > 0
          ? `你獲得${change.delta}元`
          : `你失去${Math.abs(change.delta)}元`
      );
    }
  }

  res.json(preview).status(200);
});

router.post("/series", async (req, res) => {
  const { teamId, area } = req.body;
  const count = await (
    await Land.find({ area, owner: teamId })
  ).filter((land) => land.owner > 0).length;
  res.json({ count }).status(200);
});

router.post("/soldout", async (req, res) => {
  const { id, building } = req.body;
  const teamId = parseInt(id, 10);
  const landId = parseInt(building, 10);

  if (Number.isNaN(teamId) || Number.isNaN(landId)) {
    res.status(400).json({ error: "Invalid team or building id" });
    return;
  }

  const team = await Team.findOne({ id: teamId });
  const land = await Land.findOne({ id: landId });

  if (!team || !land) {
    res.status(404).json({ error: "Team or building not found" });
    return;
  }

  if (land.owner !== teamId) {
    res.status(400).json({ error: "Building is not owned by this team" });
    return;
  }

  const propertyValue = land.price.buy + land.price.upgrade * (land.level - 1);
  team.money += Math.round(propertyValue * 0.5);
  land.level = 0;
  land.owner = 0;
  await team.save();
  await land.save();

  const groupIds = getSeriesBonusGroup(land.id);
  if (groupIds) await recalculateSeriesBonus(groupIds);

  res.json("Success").status(200);
});

router.post("/accounting", async (req, res) => {
  const teams = await Team.find().sort({ id: 1 });
  const resourcePrices = await Resource.find().sort({ id: 1 });
  const lovePrice =
    resourcePrices.find((resource) => resource.id === 0)?.price || 0;
  const eecoinPrice =
    resourcePrices.find((resource) => resource.id === 1)?.price || 0;
  const results = [];

  for (let i = 0; i < teams.length; i++) {
    const lands = await Land.find({ owner: teams[i].id });
    let propertyValue = 0;
    for (let i = 0; i < lands.length; i++) {
      propertyValue +=
        (lands[i].price.buy + lands[i].price.upgrade * (lands[i].level - 1)) *
        0.9;
    }
    propertyValue = Math.round(propertyValue);
    const cash = Math.round(teams[i].money);
    const resourceValue =
      (teams[i].resources?.love || 0) * lovePrice +
      (teams[i].resources?.eecoin || 0) * eecoinPrice;

    results.push({
      teamId: teams[i].id,
      teamname: teams[i].teamname,
      cash,
      resourceValue,
      propertyValue,
      total: cash + resourceValue + propertyValue,
    });

    teams[i].money += propertyValue;
    await teams[i].save();
    await Land.updateMany(
      { owner: teams[i].id },
      { $set: { owner: 0, level: 0 } }
    );
  }
  res.status(200).json({ message: "Success", results });
});

router.post("/rob", async (req, res) => {
  const { id } = req.body;
  const team = await Team.find({ id: id });
  const teams = await Team.find().sort({ money: 1 });
  const lands = await Land.find({ owner: teams[0].id, level: 1 });

  if (lands.length === 0) {
    req.io.emit("broadcast", {
      title: "趁火打劫發動",
      description: `${team[0].teamname}使用了趁火打劫，但${teams[0].teamname}逃過一劫...`,
    });
  } else {
    const index = Math.floor(Math.random() * lands.length);
    lands[index].owner = id;
    await lands[index].save();
    req.io.emit("broadcast", {
      title: "趁火打劫發動",
      description: `${team[0].teamname}使用了趁火打劫, 搶走${teams[0].teamname}的${lands[index].name}, 2ㄏ2ㄏ`,
    });
    res.json({ building: lands[index].id }).status(200);
  }
});

router.post("/equility", async (req, res) => {
  const { id } = req.body;
  const team = await Team.find({ id: id });
  const teams = await Team.find().sort({ money: 1 });
  let order = -1;
  for (let i = 0; i < teams.length; i++) {
    if (teams[i].id === id) order = i;
  }
  if (order + 1 === teams.length) {
    team[0].money -= 10000;
    await team[0].save();
    req.io.emit("broadcast", {
      title: "實質平等發動",
      description: `${team[0].teamname}使用了實質平等, 但你太有錢了, 扣除10000元`,
    });
  } else {
    const money =
      Math.round((teams[order].money + teams[order + 1].money) * 0.05) * 10;

    teams[order].money = money;
    teams[order + 1].money = money;
    await teams[order].save();
    await teams[order + 1].save();
    req.io.emit("broadcast", {
      title: "實質平等發動",
      description: `${team[0].teamname}使用了實質平等, 與${
        teams[order + 1].teamname
      }平分金錢`,
    });
  }
  res.json("Success").status(200);
});

router.post("/handleBuff1", async (req, res) => {
  const { name } = req.body;
  console.log(name);
  const land = await Land.find({ name: name });
  land[0].buffed = 1;
  for (let i = 0; i < 3; i++) {
    land[0].rent[i] *= 1.5;
  }
  await land[0].save();
  res.json("Success").status(200);
});

router.post("/handleBuff2", async (req, res) => {
  const { name } = req.body;
  const land = await Land.find({ name: name });
  land[0].buffed = 2;
  for (let i = 0; i < 3; i++) {
    land[0].rent[i] *= 2;
  }
  await land[0].save();
  res.json("Success").status(200);
});

router.post("/handleDeBuff", async (req, res) => {
  const { name } = req.body;
  const land = await Land.find({ name: name });
  const originstatus = land[0].buffed;
  land[0].buffed = 0;
  for (let i = 0; i < 3; i++) {
    if (originstatus === 1) land[0].rent[i] /= 1.5;
    else if (originstatus === 2) land[0].rent[i] /= 2;
  }
  await land[0].save();
  res.json("Success").status(200);
});

const normalizeTransferPayload = ({ from, to, dollar, IsEstate, landName }) => {
  const payload = {
    from: Number(from),
    to: Number(to),
    dollar: Number(dollar),
    IsEstate: IsEstate === true || IsEstate === "true",
    landName,
  };

  if (
    !Number.isFinite(payload.from) ||
    !Number.isFinite(payload.to) ||
    !Number.isFinite(payload.dollar)
  ) {
    return null;
  }

  return payload;
};

const formatTeamName = (teamId) => `第${String(teamId).padStart(2, "0")}小隊`;

const calcTransfer = async (from, to, amount, isEstate) => {
  from = Number(from);
  to = Number(to);
  amount = Number(amount);

  if (!Number.isFinite(from) || !Number.isFinite(to) || !Number.isFinite(amount))
    return null;
  if (from === to) return null;

  const FromTeam = await Team.findOne({ id: from }); //minus
  const ToTeam = await Team.findOne({ id: to }); //add
  if (!FromTeam || !ToTeam) {
    console.log("error finding teams in func: calcTransfer");
    return null;
  }

  var FromAmount = Number(FromTeam.money);
  var ToAmount = Number(ToTeam.money);
  var TransferAmount = Number(amount);
  const bonusValue = Number(ToTeam.bonus?.value ?? 1);
  console.log(TransferAmount, bonusValue);
  if (isEstate && bonusValue !== 0) TransferAmount *= bonusValue;

  console.log(TransferAmount);
  if (FromTeam.soulgem?.value)
    FromAmount -= parseInt(Math.round(TransferAmount * 1.5));
  else FromAmount -= TransferAmount;

  if (ToTeam.soulgem?.value)
    ToAmount += parseInt(Math.round(TransferAmount * 2));
  else ToAmount += TransferAmount;
  console.log({ from: FromAmount, to: ToAmount });
  return { from: FromAmount, to: ToAmount };
};

router.post("/transfer", async (req, res) => {
  const payload = normalizeTransferPayload(req.body);
  if (!payload) return res.status(400).send("Invalid transfer payload");

  const { from, to, IsEstate, dollar, landName } = payload;
  //update team status
  await Team.findAndCheckValid(from);
  await Team.findAndCheckValid(to);

  const data = await calcTransfer(from, to, dollar, IsEstate);
  if (!data) {
    console.log("Transfer failed");
    return res.status(403).send("Transfer failed");
  } else {
    await Team.findOneAndUpdate({ id: from }, { money: data.from });
    await Team.findOneAndUpdate({ id: to }, { money: data.to });
    if (IsEstate) {
      req.io.emit("broadcast", {
        targetTeamId: to,
        title: "收到過路費",
        description: `${formatTeamName(from)}支付了 ${dollar} 元過路費`,
        note: landName ? `地產：${landName}` : "",
      });
    }
    res.status(200).send("Update succeeded");
    console.log("success");
  }
  console.log("in transfer");
});

router.get("/transfer", async (req, res) => {
  const payload = normalizeTransferPayload(req.query);
  if (!payload) return res.status(400).send("Invalid transfer payload");

  let { from, to, IsEstate, dollar } = payload;
  const data = await calcTransfer(from, to, dollar, IsEstate);
  console.log(data);
  if (data !== null) res.json(data).status(200);
  else res.status(403).send();
});

// async function updateHawkEye() {
//   const { value: hawkEyeTeam } = await Pair.findOne({ key: "hawkEyeTeam" });
//   if (hawkEyeTeam === 0) return;
//   // may delete some building need to clear and fill(?)
//   for (let i = 1; i <= 40; i++) {
//     await Land.findOneAndUpdate({ id: i }, { hawkEye: 0 });
//   }
//   const hawkEyeBuildings = await Land.find({ owner: hawkEyeTeam });
//   console.log(hawkEyeBuildings);
//   for (let i = 0; i < hawkEyeBuildings.length; i++) {
//     await Land.findOneAndUpdate(
//       { id: hawkEyeBuildings[i].id - 1 },
//       { hawkEye: hawkEyeBuildings[i].id }
//     );
//     await Land.findOneAndUpdate(
//       { id: hawkEyeBuildings[i].id + 1 },
//       { hawkEye: hawkEyeBuildings[i].id }
//     );
//   }
//   for (let i = 0; i < hawkEyeBuildings.length; i++) {
//     await Land.findOneAndUpdate(
//       { id: hawkEyeBuildings[i].id },
//       { hawkEye: hawkEyeBuildings[i].id }
//     );
//   }
//   console.log("hawkEye updated");
// }

router.post("/ownership", async (req, res) => {
  const { teamId, land, level } = req.body;
  const tmp1 = await Land.findOneAndUpdate({ name: land }, { owner: teamId });
  if (!tmp1) {
    res.status(403).send();
    console.log("Update failed");
    return;
  }
  const tmp2 = await Land.findOneAndUpdate({ name: land }, { level: level });
  if (!tmp2) {
    res.status(403).send();
    console.log("Update failed");
    return;
  }

  // await updateHawkEye(land);
  res.status(200).send("update succeeded");
});

router.post("/calcbonus", async (req, res) => {
  try {
    const { land } = req.body;
    console.log(req.body);
    const targetBuilding = await Land.findOne({ name: land });
    if (!targetBuilding) {
      res.status(404).json({ error: "Land not found" });
      return;
    }

    const groupIds = getSeriesBonusGroup(targetBuilding.id);
    if (groupIds) await recalculateSeriesBonus(groupIds);

    res.json("Success").status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate series bonus" });
  }
});

router.post("/acquire", async (req, res) => {
  const { land, teamId } = req.body;
  const target = await Land.find({ name: land });
  const originOwner = target[0].owner;
  const originTeam = await Team.find({ id: originOwner });
  const newTeam = await Team.find({ id: teamId });
  originTeam[0].money +=
    target[0].price.buy + (target[0].level - 1) * target[0].price.upgrade;
  newTeam[0].money -=
    target[0].price.buy + (target[0].level - 1) * target[0].price.upgrade;
  target[0].owner = teamId;

  await originTeam[0].save();
  await newTeam[0].save();
  await target[0].save();
  res.json("Success").status(200);
});

router.get("/acquireBuilding", async (req, res) => {
  const targetBuilding = Land.find({ type: "Building" }).sort({ id: 1 });
  res.json(targetBuilding).status(200);
});

router.post("/exchange", async (req, res) => {
  const { land, otherLand, teamId, otherTeamId } = req.body;
  const land_1 = await Land.find({ name: land });
  const land_2 = await Land.find({ name: otherLand });
  land_1[0].owner = otherTeamId;
  land_2[0].owner = teamId;
  await land_1[0].save();
  await land_2[0].save();
  res.json("Success").status(200);
});

router.post("/shipRepair", async (req, res) => {
  const { teamId } = req.body;
  console.log(teamId);
  const team = await Team.find({ id: teamId });
  team[0].dice = 2;
  await team[0].save();
  res.json("Success").status(200);
});

router.get("/allEffects", async (req, res) => {
  const effects = await Effect.find({}).sort({ id: 1 });
  res.json(effects).status(200);
});

router.post("/effect", async (req, res) => {
  const { teamname, title } = req.body;
  const effect = await Effect.findOne({ title });
  if (!effect) {
    res.status(403).send();
    console.log("Effect not found");
    return;
  }
  const { id, description, trait, duration, bonus } = effect;
  const team = await Team.findOne({ teamname });
  const time = Date.now() / 1000;
  if (!team) {
    res.status(403).send("Team not found");
    console.log("Team not found");
    return;
  }
  if (bonus !== -1) {
    team.bonus = { value: bonus, duration, time };
  }
  if (id === 4) {
    // soulgem
    team.soulgem = { value: true, duration, time };
  }

  const pair = await Pair.findOne({ key: "lastNotificationId" });
  const type = trait ? "temporary" : "permanent";
  const notification = {
    id: pair.value,
    type,
    teamname,
    title,
    description: `${teamname}: ${description}`,
    duration,
    createdAt: time,
  };
  // await deleteTimeoutNotification();
  // save
  console.log(notification);
  await new Notification(notification).save();
  await team.save();
  req.io.emit("broadcast", notification);
  res.status(200).send("Update succeeded");
});

router
  .post("/broadcast", async (req, res) => {
    const { title, description, level } = req.body;
    let time = Date.now();
    const broadcast = {
      createdAt: time,
      title: title,
      description: description,
      level: level,
    };
    await new Broadcast(broadcast).save();
    req.io.emit("broadcast", { title, description, level });
    res.status(200).send("Broadcast succeeded");
    console.log("broadcast sent");
  })
  .get("/broadcast", async (req, res) => {
    const data = await Broadcast.find({}).sort({ createdAt: -1 });
    res.json(data).status(200);
  })
  .delete("/broadcast/:createdAt", async (req, res) => {
    const { createdAt } = req.params;
    const data = await Broadcast.findOneAndDelete({ createdAt });
    res.json(data).status(200);
  });

router.get("/notifications", async (req, res) => {
  await deleteTimeoutNotification();
  // save
  const newNotifications = await Notification.find();
  res.json(newNotifications).status(200);
});

// router.post("/bonus", async (req, res) => {
//   console.log(req.body);
//   const { teamname, bonus, duration } = req.body;
//   const time = Date.now() / 1000;
//   const team = await Team.findOneAndUpdate(
//     { teamname: teamname },
//     { bonus: { value: bonus, time: time, duration: duration } }
//   );
//   if (!team) {
//     res.status(403).send();
//     console.log("Update failed");
//     return;
//   }
//   res.status(200).send("update succeeded");
// });

// router.post("/soulgem", async (req, res) => {
//   const { teamname } = req.body;
//   const time = Date.now() / 1000;
//   const team = await Team.findOneAndUpdate(
//     { teamname: teamname },
//     { soulgem: { value: true, time: time } }
//   );
//   if (!team) {
//     res.status(403).send();
//     console.log("Update failed");
//     return;
//   }
//   res.status(200).send("update succeeded");
// });

// router.get("/checkvalid", async (req, res) => {
//   const { teamname } = req.query;
//   const team = await findAndCheckValid(teamname);
//   res.status(200).send(team);
// });

// Login
router.post("/login", async (req, res) => {
  // console.log(req.body);
  const { username, password } = req.body;
  // console.log(username);
  // console.log(password);
  const user = await User.findAndValidate(username, password);
  if (!user) {
    res.status(200).send({ username: "" });
    console.log("login failed");
    return;
  }
  res.status(200).send({ username: user.username });
  // null, npc, admin: String
});

router.get("/room", async (req, res) => {
  res.status(200).send(req.io.room);
});

// router.post("/logout", async (req, res) => {
//   req.session.destroy();
//   res.status(200).send("logout success");
// });

// router.get("/adminsecret", requireAdmin, async (req, res) => {
//   res.status(200).send("admin secret");
// });

// router.get("/npcsecret", requireNPC, async (req, res) => {
//   res.status(200).send("npc secret");
// });

export default router;
