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
    bank: 0,
    deposit: 0,
    resourcesName: {  eecoin: "EE幣" },
    resources: {  eecoin: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 2,
    teamname: "第02小隊",
    // occupation: "N/A",
    money: 40000,
    bank: 0,
    deposit: 0,
    resourcesName: {  eecoin: "EE幣" },
    resources: {  eecoin: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 3,
    teamname: "第03小隊",
    // occupation: "N/A",
    money: 40000,
    bank: 0,
    deposit: 0,
    resourcesName: {  eecoin: "EE幣" },
    resources: {  eecoin: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 4,
    teamname: "第04小隊",
    // occupation: "N/A",
    money: 40000,
    bank: 0,
    deposit: 0,
    resourcesName: {  eecoin: "EE幣" },
    resources: {  eecoin: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 5,
    teamname: "第05小隊",
    // occupation: "N/A",
    money: 40000,
    bank: 0,
    deposit: 0,
    resourcesName: {  eecoin: "EE幣" },
    resources: {  eecoin: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 6,
    teamname: "第06小隊",
    // occupation: "N/A",
    money: 40000,
    bank: 0,
    deposit: 0,
    resourcesName: {  eecoin: "EE幣" },
    resources: {  eecoin: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 7,
    teamname: "第07小隊",
    // occupation: "N/A",
    money: 40000,
    bank: 0,
    deposit: 0,
    resourcesName: {  eecoin: "EE幣" },
    resources: {  eecoin: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 8,
    teamname: "第08小隊",
    // occupation: "N/A",
    money: 40000,
    bank: 0,
    deposit: 0,
    resourcesName: {  eecoin: "EE幣" },
    resources: {  eecoin: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 9,
    teamname: "第09小隊",
    // occupation: "N/A",
    money: 40000,
    bank: 0,
    deposit: 0,
    resourcesName: {  eecoin: "EE幣" },
    resources: {  eecoin: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 10,
    teamname: "第10小隊",
    // occupation: "N/A",
    money: 40000,
    bank: 0,
    deposit: 0,
    resourcesName: {  eecoin: "EE幣" },
    resources: {  eecoin: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
];

const resources = [
  // {
  //   id: 0,
  //   name: "總召的愛",
  //   price: 10000
  // },
  {
    id: 0,
    name: "贖罪券",
    price: 10000
  },
]

const lands = [
  { id: 1, type: "Game", name: "詞語接龍", description: "認真聽規則！", owner: 0},
  {
    id: 2,
    type: "Building",
    area: 1,
    name: "玉皇大地",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 10000, upgrade: 5000 },
    rent: [4000, 8000, 12000],
  },
  {
    id: 3,
    type: "Building",
    area: 1,
    name: "飛田新地",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 12000, upgrade: 6000 },
    rent: [6000, 10000, 14000],
  },
  {
    id: 4,
    type: "Building",
    area: 1,
    name: "垃圾不落地",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 14000, upgrade: 7000 },
    rent: [8000, 12000, 16000],
  },
  { id: 5, type: "Transport", name: "轉運站", description: "運氣不好?那就來轉運站!" , owner: 0},
  { id: 6, type: "Game", name: "猜歌名", description: "認真聽規則！", owner: 0 },
  { id: 7, type: "Bank", name: "銀行", description: "存錢拿利息", owner: 0 },
  {
    id: 8,
    type: "Building",
    area: 1,
    name: "歡天喜地",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 10000, upgrade: 5000 },
    rent: [4000, 8000, 12000],
  },
  {
    id: 9,
    type: "Building",
    area: 1,
    name: "阿地",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy:12000, upgrade: 6000 },
    rent: [6000, 10000, 14000],
  },
  {
    id: 10,
    type: "Building",
    area: 1,
    name: "黃氏兄地",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy:14000, upgrade: 7000 },
    rent: [8000, 12000, 16000],
  },
  { id: 11, type: "Game", name: "排列組合期末考", description: "認真聽規則！", owner: 0 },
  {
    id: 12,
    type: "Jail",
    name: "尬電大監獄",
    description: "進監獄囉，真爽",
    owner: 0,
  },
  {
    id: 13,
    type: "Chance",
    name: "機會",
    description: "為你的未來重新洗牌！",
    owner: 0,
  },
  {
    id: 14,
    type: "Chance",
    name: "命運",
    description: "為你的未來重新洗牌！",
    owner : 0,
  },
  { id: 15, type: "Game", name: "紙飛機", description: "認真聽規則！", owner: 0 },
  {
    id: 16,
    type: "Building",
    area: 1,
    name: "甘地",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 10000, upgrade: 5000 },
    rent: [4000, 8000, 12000],
  },
  {
    id: 17,
    type: "Building",
    area: 1,
    name: "龍兄虎地",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 12000, upgrade: 6000 },
    rent: [6000, 10000, 14000],
  },
  {
    id: 18,
    type: "Building",
    area: 1,
    name: "馬力兄地",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 14000, upgrade: 7000 },
    rent: [8000, 12000, 16000],
  },
  { id: 19, type: "Arena", name: "唬爛王", description: "來決鬥吧！", owner: 0 },
  { id: 20, type: "Game", name: "猜英文歌", description: "認真聽規則！" , owner: 0},
  {
    id: 21,
    type: "Building",
    area: 1,
    name: "白蘭地",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 10000, upgrade: 5000 },
    rent: [4000, 8000, 12000],
  },
  {
    id: 22,
    type: "Building",
    area: 1,
    name: "出人頭地",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 12000, upgrade: 6000 },
    rent: [6000, 10000, 14000],
  },
  {
    id: 23,
    type: "Building",
    area: 1,
    name: "超級快地",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 14000, upgrade: 7000 },
    rent: [8000, 12000, 16000],
  },
  { id: 24, type: "Game", name: "注音猜詞", description: "認真聽規則！", owner: 0 },
  {
    id: 25,
    type: "Chance",
    name: "機會",
    description: "為你的未來重新洗牌！",
    owner: 0,
  },
  {
    id: 26,
    type: "Chance",
    name: "命運",
    description: "為你的未來重新洗牌！",
    owner: 0,
  },
  {
    id: 27,
    type: "Building",
    area: 1,
    name: "違規取地",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 10000, upgrade: 5000 },
    rent: [4000, 8000, 12000],
  },
  {
    id: 28,
    type: "Building",
    area: 1,
    name: "五體投地",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 12000, upgrade: 6000 },
    rent: [6000, 10000, 14000],
  },
  {
    id: 29,
    type: "Building",
    area: 1,
    name: "腳踏實地",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 14000, upgrade: 7000 },
    rent: [8000, 12000, 16000],
  },
  { id: 30, type: "Game", name: "猜古文", description: "認真聽規則！", owner: 0 },
  {
    id: 31,
    type: "Chance",
    name: "機會",
    description: "為你的未來重新洗牌！",
    owner: 0,
  },
  {
    id: 32,
    type: "Chance",
    name: "命運",
    description: "為你的未來重新洗牌！",
    owner: 0,
  },
  { id: 33, type: "Transport", name: "轉運站", description: "運氣不好?那就來轉運站!", owner: 0 },
  { id: 34, type: "Arena", name: "碰撞機器人", description: "來決鬥吧！", owner: 0 },
  {
    id: 35,
    type: "Building",
    area: 1,
    name: "亂丟菸地",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 10000, upgrade: 5000 },
    rent: [4000, 8000, 12000],
  },
  {
    id: 36,
    type: "Building",
    area: 1,
    name: "張家兄地",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 12000, upgrade: 6000 },
    rent: [6000, 10000, 14000],
  },
  {
    id: 37,
    type: "Building",
    area: 1,
    name: "冰天雪地",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 14000, upgrade: 7000 },
    rent: [8000, 12000, 16000],
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
    title: "反安倍三支箭",
    description:
      "銀行升息成30%",
  },
  {
    id: 2,
    title: "逃犯越獄",
    description: "獄卒氣憤不已，隨機抽取3支隊伍當替死鬼進監獄",
  },
  {
    id: 3,
    title: "馬斯克發廢文",
    description: "贖罪券暴跌",
  },
  {
    id: 4,
    title: "銀行倒閉，金融危機",
    description: "銀行倒了，裡面所有的錢都拿去修建銀行，這段期間銀行暫停所有功能",
  },
  {
    id: 5,
    title: "富翁掉錢",
    description: "特定幾格有放上現金，先走到先拿",
  },
  {
    id: 6,
    title: "男同俱樂部",
    description: "所有男隊輔進監獄，花6000元救回他們",
  },
  {
    id: 7,
    title: "納稅",
    description:
      "全隊上交手頭50%的現金",
  },
  {
    id: 8,
    title: "地震",
    description:
      "一棟房子扣5000",
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
