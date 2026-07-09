import mongoose from "mongoose";
const Schema = mongoose.Schema;
const EventSchema = new Schema({
  id: Number,
  title: String,
  description: String,
  note: String,
  createdAt: Number,
});

const Event = mongoose.model("Event", EventSchema);
export default Event;
