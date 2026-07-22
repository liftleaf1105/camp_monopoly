import mongoose from "mongoose";
const Schema = mongoose.Schema;
const BroadcastSchema = new Schema({
  createdAt: Number,
  title: String,
  description: String,
  note: String,
  level: Number,
  targetTeamId: Number,
  category: String,
});

const Broadcast = mongoose.model("broadcast", BroadcastSchema);
export default Broadcast;
