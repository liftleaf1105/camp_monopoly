import mongoose from "mongoose";
import dotenv from "dotenv-defaults";
import Team from "../models/team.js";
import Land from "../models/land.js";
import User from "../models/user.js";
import Resource from "../models/resource.js";
import Notification from "../models/notification.js";
import Broadcast from "../models/broadcast.js";
import Event from "../models/event.js";
import Pair from "../models/pair.js";
import Effect from "../models/effect.js";

dotenv.config();
console.log(process.env.MONGO_URL);

const db = mongoose.connection;
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const users = [
  {
    username: "admin",
    password: "adminNTUEE",
  },
  {
    username: "NPC",
    password: "pp9AxWvSh35z",
  },
  {
    username: "team01",
    password: "aY7w2z3D",
  },
  {
    username: "team02",
    password: "cvEGgStw",
  },
  {
    username: "team03",
    password: "UAwGZSc7",
  },
  {
    username: "team04",
    password: "gCy2eWBA",
  },
  {
    username: "team05",
    password: "fzUegff2",
  },
  {
    username: "team06",
    password: "7PPFT5QD",
  },
  {
    username: "team07",
    password: "Sb4GeGAH",
  },
  {
    username: "team08",
    password: "9WbxwUsS",
  },
  {
    username: "team09",
    password: "rkMPmnqw",
  },
  {
    username: "team10",
    password: "MeBNNkM4",
  },
];

const teams = [
  {
    id: 1,
    teamname: "第01小隊",
    // occupation: "N/A",
    money: 40000,
    deposit: 0,
    resourcesName: { love: "總召的愛", eecoin: "EE幣" },
    resources: { love: 0, eecoin: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 2,
    teamname: "第02小隊",
    // occupation: "N/A",
    money: 40000,
    deposit: 0,
    resourcesName: { love: "總召的愛", eecoin: "EE幣" },
    resources: { love: 0, eecoin: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 3,
    teamname: "第03小隊",
    // occupation: "N/A",
    money: 40000,
    deposit: 0,
    resourcesName: { love: "總召的愛", eecoin: "EE幣" },
    resources: { love: 0, eecoin: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 4,
    teamname: "第04小隊",
    // occupation: "N/A",
    money: 40000,
    deposit: 0,
    resourcesName: { love: "總召的愛", eecoin: "EE幣" },
    resources: { love: 0, eecoin: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 5,
    teamname: "第05小隊",
    // occupation: "N/A",
    money: 40000,
    deposit: 0,
    resourcesName: { love: "總召的愛", eecoin: "EE幣" },
    resources: { love: 0, eecoin: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 6,
    teamname: "第06小隊",
    // occupation: "N/A",
    money: 40000,
    deposit: 0,
    resourcesName: { love: "總召的愛", eecoin: "EE幣" },
    resources: { love: 0, eecoin: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 7,
    teamname: "第07小隊",
    // occupation: "N/A",
    money: 40000,
    deposit: 0,
    resourcesName: { love: "總召的愛", eecoin: "EE幣" },
    resources: { love: 0, eecoin: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 8,
    teamname: "第08小隊",
    // occupation: "N/A",
    money: 40000,
    deposit: 0,
    resourcesName: { love: "總召的愛", eecoin: "EE幣" },
    resources: { love: 0, eecoin: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 9,
    teamname: "第09小隊",
    // occupation: "N/A",
    money: 40000,
    deposit: 0,
    resourcesName: { love: "總召的愛", eecoin: "EE幣" },
    resources: { love: 0, eecoin: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 10,
    teamname: "第10小隊",
    // occupation: "N/A",
    money: 40000,
    deposit: 0,
    resourcesName: { love: "總召的愛", eecoin: "EE幣" },
    resources: { love: 0, eecoin: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
];

const resources = [
  {
    id: 0,
    name: "總召的愛",
    price: 10000
  },
  {
    id: 1,
    name: "EE幣",
    price: 10000
  },
]

const lands = [
  { id: 1, type: "Game", name: "遊戲格", description: "認真聽規則！" },
  {
    id: 2,
    type: "Building",
    area: 1,
    name: "椰林大道",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 10000, upgrade: 6000 },
    rent: [2000, 4000, 10000],
  },
  {
    id: 3,
    type: "Building",
    area: 1,
    name: "台北故宮",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 10000, upgrade: 6000 },
    rent: [2000, 4000, 10000],
  },
  {
    id: 4,
    type: "Building",
    area: 1,
    name: "東京鐵塔",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 10000, upgrade: 6000 },
    rent: [2000, 4000, 10000],
  },
  { id: 5, type: "Game", name: "遊戲格", description: "認真聽規則！" },
  {
    id: 6,
    type: "Building",
    area: 1,
    name: "東非大裂谷",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy:11000, upgrade: 7000 },
    rent: [2200, 4400, 11000],
  },
  {
    id: 7,
    type: "Building",
    area: 1,
    name: "蘇易士運河",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy:11000, upgrade: 7000 },
    rent: [2200, 4400, 11000],
  },
  {
    id: 8,
    type: "Building",
    area: 1,
    name: "埃及金字塔",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy:11000, upgrade: 7000 },
    rent: [2200, 4400, 11000],
  },
  { id: 9, type: "Game", name: "遊戲格", description: "認真聽規則！" },
  {
    id: 10,
    type: "Jail",
    name: "電機系大監獄",
    description: "進監獄囉，真爽",
  },
  {
    id: 11,
    type: "Chance",
    name: "機會命運",
    description: "為你的未來重新洗牌！",
  },
  {
    id: 12,
    type: "Clue",
    name: "提示格",
    description: "你能猜到提示嗎?",
  },
  { id: 13, type: "Game", name: "遊戲格", description: "認真聽規則！" },
  {
    id: 14,
    type: "Building",
    area: 1,
    name: "袋鼠的家",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 12000, upgrade: 7000 },
    rent: [2400, 4800, 12000],
  },
  {
    id: 15,
    type: "Building",
    area: 1,
    name: "大堡礁",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 12000, upgrade: 7000 },
    rent: [2400, 4800, 12000],
  },
  {
    id: 16,
    type: "Building",
    area: 1,
    name: "雪梨歌劇院",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 12000, upgrade: 7000 },
    rent: [2400, 4800, 12000],
  },
  { id: 17, type: "Game", name: "遊戲格", description: "認真聽規則！" },
  {
    id: 18,
    type: "Building",
    area: 1,
    name: "比薩斜塔",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 14000, upgrade: 9000 },
    rent: [2800, 5600, 14000],
  },
  {
    id: 19,
    type: "Building",
    area: 1,
    name: "艾菲爾鐵塔",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 14000, upgrade: 9000 },
    rent: [2800, 5600, 14000],
  },
  {
    id: 20,
    type: "Building",
    area: 1,
    name: "大笨鐘",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 14000, upgrade: 9000 },
    rent: [2800, 5600, 14000],
  },
  { id: 21, type: "Game", name: "遊戲格", description: "認真聽規則！" },
  {
    id: 22,
    type: "Arena",
    name: "鬥牛競技場",
    description: "來決鬥吧！",
  },
  {
    id: 23,
    type: "Chance",
    name: "機會命運",
    description: "為你的未來重新洗牌！",
  },
  {
    id: 24,
    type: "Clue",
    name: "提示格",
    description: "你能猜到提示嗎?",
  },
  { id: 25, type: "Game", name: "遊戲格", description: "認真聽規則！" },
  {
    id: 26,
    type: "Building",
    area: 1,
    name: "拉斯維加斯",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 16000, upgrade: 10000 },
    rent: [3200, 6400, 16000],
  },
  {
    id: 27,
    type: "Building",
    area: 1,
    name: "尼加拉瀑布",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 16000, upgrade: 10000 },
    rent: [3200, 6400, 16000],
  },
  {
    id: 28,
    type: "Building",
    area: 1,
    name: "帝國大廈",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 16000, upgrade: 10000 },
    rent: [3200, 6400, 16000],
  },
  { id: 29, type: "Game", name: "遊戲格", description: "認真聽規則！" },
  {
    id: 30,
    type: "Chance",
    name: "機會命運",
    description: "為你的未來重新洗牌！",
  },
  {
    id: 31,
    type: "Card",
    name: "卡片商店",
    description: "多種卡片任君挑選",
  },
  {
    id: 32,
    type: "Transport",
    name: "轉運站",
    description: "運氣不好?那就來轉運站!",
  },
  { id: 33, type: "Game", name: "遊戲格", description: "認真聽規則！" },
  {
    id: 34,
    type: "Building",
    area: 1,
    name: "智利高原",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 18000, upgrade: 12000 },
    rent: [3600, 7200, 18000],
  },
  {
    id: 35,
    type: "Building",
    area: 1,
    name: "馬丘比丘",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 18000, upgrade: 12000 },
    rent: [3600, 7200, 18000],
  },
  {
    id: 36,
    type: "Building",
    area: 1,
    name: "伊瓜蘇瀑布",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 18000, upgrade: 12000 },
    rent: [3600, 7200, 18000],
  },
  {
    id: 37,
    type: "Arena",
    name: "天空競技場",
    description: "來決鬥吧！",
  },
  { id: 38, type: "Game", name: "遊戲格", description: "認真聽規則！" },
  {
    id: 39,
    type: "Building",
    area: 1,
    name: "企鵝的老巢",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy:20000, upgrade: 14000 },
    rent: [4000, 8000, 20000],
  },
  {
    id: 40,
    type: "Building",
    area: 1,
    name: "總召的宿舍",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy:20000, upgrade: 14000 },
    rent: [4000, 8000, 20000],
  },
  {
    id: 41,
    type: "Building",
    area: 1,
    name: "海豹的學校",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy:20000, upgrade: 14000 },
    rent: [4000, 8000, 20000],
  },
  {
    id: 42,
    type: "Chance",
    name: "機會命運",
    description: "為你的未來重新洗牌！",
  },
];

const events = [
  {
    id: 0,
    title: "無",
    description: "",
  },
  {
    id: 1,
    title: "山賊入侵",
    description:
      "遭遇打劫，各組金錢資源減少30%",
  },
  {
    id: 2,
    title: "逃犯越獄",
    description: "獄卒氣憤不已，隨機抽取3支隊伍當替死鬼進監獄",
  },
  {
    id: 3,
    title: "同伴遇難",
    description: "其中一個小隊員遭敵人抓走，須前往監獄營救",
  },
  {
    id: 4,
    title: "大富翁",
    description: "普雷提升經濟，EE幣大漲",
  },
  {
    id: 5,
    title: "八國革命",
    description: "各國響應革命，NPC同時呼口號，因為戰爭，EE幣暴跌",
  },
  {
    id: 6,
    title: "屠魔令",
    description: "各組消耗大量資源躲避追緝，各組物資減少50%(四捨五入)",
  },
  {
    id: 7,
    title: "快速道路",
    description:
      "普雷興建高速公路，各組下一次同時前進15格，同時因為EE幣流動性大升，價格大漲",
  },
  {
    id: 8,
    title: "魔法失效",
    description:
      "遊戲結束前無法使用卡片，同時EE幣跟著暴跌",
  },
];

// const effects = [
//   {
//     id: 1,
//     title: "地產增值(I)",
//     description: "房地產租金提升至150%, 效果持續10分鐘。不可疊加使用",
//     trait: 1,
//     duration: 600,
//     bonus: 1.5,
//   },
//   {
//     id: 2,
//     title: "財產凍結",
//     description: "其他小隊踩到此小隊的房產無須付租金, 效果持續5分鐘",
//     trait: 1,
//     duration: 300,
//     bonus: 0,
//   },
//   {
//     id: 3,
//     title: "量子領域",
//     description:
//       "選擇一個區域, 若其他小隊停在此區域會損失10%手上的金錢, 效果持續10分鐘",
//     trait: 1,
//     duration: 600,
//     bonus: -1,
//   },
//   {
//     id: 4,
//     title: "靈魂寶石",
//     description:
//       "所需支付的金錢提升至150%, 但同時所獲得的金錢提升至200%, 效果持續10分鐘",
//     trait: 1,
//     duration: 600,
//     bonus: -1,
//   },
//   {
//     id: 5,
//     title: "地產增值(II)",
//     description: "房地產租金提升至200%, 效果持續10分鐘。不可疊加使用",
//     trait: 1,
//     duration: 600,
//     bonus: 2,
//   },
//   {
//     id: 6,
//     title: "double一下",
//     description:
//       "選擇一個區域。若持有該區域數量-1的房產即可獲得double效果, 此效果沒有時間限制",
//     trait: 0,
//     duration: -1,
//     bonus: -1,
//   },
//   {
//     id: 7,
//     title: "時間寶石",
//     description: "強制其他小隊接下來的3回合內必須倒著走, GO格沒錢領",
//     trait: 1,
//     duration: 300,
//     bonus: -1,
//   },
// ];

const notifications = [
  {
    id: 0,
    title: "歡迎遊玩大富翁",
    description: "衝啊",
    type: "temporary",
    duration: 1800,
    createdAt: 0,
  },
  // {
  //   id: 1,
  //   title: "Test temporary",
  //   description: "temporary",
  //   type: "temporary",
  //   duration: 10,
  //   createdAt: Date.now() / 1000,
  // },
];

const pairs = [
  {
    key: "currentEvent",
    value: 0,
  },
  {
    key: "lastNotificationId",
    value: 0,
  },
  {
    key: "hawkEyeTeam",
    value: 0,
  },
  {
    key: "phase",
    value: 1,
  },
];

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("db connected");
  await Team.deleteMany({});
  await Land.deleteMany({});
  await Resource.deleteMany({});
  await User.deleteMany({});
  await Event.deleteMany({});
  await Pair.deleteMany({});
  await Notification.deleteMany({});
  await Effect.deleteMany({});
  await Broadcast.deleteMany({});
  console.log("delete done");

  users.forEach(async (user) => {
    await new User(user).save();
  });
  console.log("users created");

  lands.forEach(async (ground) => {
    await new Land(ground).save();
  });
  console.log("lands created");

  resources.forEach(async (row) => {
    await new Resource(row).save();
  });
  console.log("resources created");

  teams.forEach(async (row) => {
    await new Team(row).save();
  });
  console.log("teams created");

  events.forEach(async (row) => {
    await new Event(row).save();
  });
  console.log("events created");

  pairs.forEach(async (row) => {
    await new Pair(row).save();
  });
  console.log("pairs created");

  notifications.forEach(async (row) => {
    await new Notification(row).save();
  });
  console.log("notifications created");

  // effects.forEach(async (row) => {
  //   await new Effect(row).save();
  // });
  // console.log("effects created");

  console.log("finish saving data");
});
