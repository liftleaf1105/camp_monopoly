import Team from "../../models/team.js";
import Land from "../../models/land.js";
import Resource from "../../models/resource.js";
import Event from "../../models/event.js";
import Pair from "../../models/pair.js";

const getBaseRent = (land) => {
  const buyPrice = land.price?.buy;
  if (!buyPrice) return land.rent || [];
  return [0.2, 0.4, 1].map((multiplier) => Math.round(buyPrice * multiplier));
};

const toDateTimeString = (value) => {
  if (!value) return "";
  const timestamp = value < 10000000000 ? value * 1000 : value;
  return new Date(timestamp).toISOString();
};

export const buildBackupSnapshot = async () => {
  const [teams, lands, resources, currentEventPair] = await Promise.all([
    Team.find().sort({ id: 1 }).lean(),
    Land.find().sort({ id: 1 }).lean(),
    Resource.find().sort({ id: 1 }).lean(),
    Pair.findOne({ key: "currentEvent" }).lean(),
  ]);

  const currentEventId = Number(currentEventPair?.value || 0);
  const currentEvent =
    currentEventId > 0 ? await Event.findOne({ id: currentEventId }).lean() : null;

  return {
    generatedAt: new Date(),
    generatedAtText: new Date().toISOString(),
    teams: teams.map((team) => ({
      id: team.id,
      teamname: team.teamname,
      money: Math.round(team.money || 0),
      love: team.resources?.love || 0,
      eecoin: team.resources?.eecoin || 0,
      isBankrupt: Number(team.money || 0) < 0,
      bankruptcyCount: team.bankruptcyCount || 0,
    })),
    lands: lands.map((land) => {
      const baseRent = getBaseRent(land);
      return {
        id: land.id,
        type: land.type,
        name: land.name,
        area: land.area || "",
        owner: land.owner || 0,
        level: land.level || 0,
        buffed: land.buffed || 0,
        buyPrice: land.price?.buy || "",
        upgradePrice: land.price?.upgrade || "",
        baseRentLv1: baseRent[0] || "",
        baseRentLv2: baseRent[1] || "",
        baseRentLv3: baseRent[2] || "",
        effectiveRentLv1: land.rent?.[0] || "",
        effectiveRentLv2: land.rent?.[1] || "",
        effectiveRentLv3: land.rent?.[2] || "",
      };
    }),
    resources: resources.map((resource) => ({
      id: resource.id,
      name: resource.name,
      price: resource.price,
    })),
    currentEvent: {
      id: currentEventId,
      title: currentEvent?.title || "無",
      description: currentEvent?.description || "",
      note: currentEvent?.note || "",
      createdAt: currentEvent?.createdAt || 0,
      createdAtText: toDateTimeString(currentEvent?.createdAt),
    },
  };
};

export const snapshotToSheets = (snapshot) => {
  const resourcePriceByName = new Map(
    snapshot.resources.map((resource) => [resource.name, resource.price])
  );

  return {
    "小隊狀態": [
      [
        "小隊ID",
        "小隊名稱",
        "現金",
        "贖罪券",
        "EE幣",
        "贖罪券價格",
        "EE幣價格",
        "總資產",
        "是否破產",
        "破產次數",
      ],
      ...snapshot.teams.map((team) => [
        team.id,
        team.teamname,
        team.money,
        team.love,
        team.eecoin,
        resourcePriceByName.get("贖罪券") || 0,
        resourcePriceByName.get("EE幣") || 0,
        team.money +
          team.love * (resourcePriceByName.get("贖罪券") || 0) +
          team.eecoin * (resourcePriceByName.get("EE幣") || 0),
        team.isBankrupt ? "是" : "否",
        team.bankruptcyCount,
      ]),
    ],
    "地產狀態": [
      [
        "地產ID",
        "類型",
        "名稱",
        "區域",
        "擁有者ID",
        "等級",
        "系列加成等級",
        "購買價格",
        "升級價格",
        "原始租金Lv1",
        "原始租金Lv2",
        "原始租金Lv3",
        "有效租金Lv1",
        "有效租金Lv2",
        "有效租金Lv3",
      ],
      ...snapshot.lands.map((land) => [
        land.id,
        land.type,
        land.name,
        land.area,
        land.owner,
        land.level,
        land.buffed,
        land.buyPrice,
        land.upgradePrice,
        land.baseRentLv1,
        land.baseRentLv2,
        land.baseRentLv3,
        land.effectiveRentLv1,
        land.effectiveRentLv2,
        land.effectiveRentLv3,
      ]),
    ],
    "物資價格": [
      ["物資ID", "物資名稱", "目前價格"],
      ...snapshot.resources.map((resource) => [
        resource.id,
        resource.name,
        resource.price,
      ]),
    ],
    "目前事件": [
      ["欄位", "值"],
      ["事件ID", snapshot.currentEvent.id],
      ["標題", snapshot.currentEvent.title],
      ["描述", snapshot.currentEvent.description],
      ["備註", snapshot.currentEvent.note],
      ["觸發時間", snapshot.currentEvent.createdAtText],
    ],
    "恢復操作表": [
      ["順序", "操作", "狀態", "備註"],
      [1, "確認總覽的最後成功同步時間", "", ""],
      [2, "依小隊狀態恢復現金、物資、破產次數", "", ""],
      [3, "依地產狀態恢復擁有者、等級、系列加成、租金", "", ""],
      [4, "依物資價格恢復贖罪券與EE幣價格", "", ""],
      [5, "依目前事件確認事件狀態與備註", "", ""],
    ],
    "總覽": [
      ["欄位", "值"],
      ["最後成功同步時間", snapshot.generatedAtText],
      ["備份模式", "最新快照，不保留歷程"],
      ["小隊數", snapshot.teams.length],
      ["地產/格子數", snapshot.lands.length],
      ["物資數", snapshot.resources.length],
      ["目前事件", snapshot.currentEvent.title],
      ["試算表ID", process.env.BACKUP_SHEET_ID || DEFAULT_BACKUP_SHEET_ID],
    ],
  };
};

export const DEFAULT_BACKUP_SHEET_ID =
  "1YaqCaYkRtzvCZ2jQHa8tYWq-kdW6wwV6TJJX5cVJVS0";
