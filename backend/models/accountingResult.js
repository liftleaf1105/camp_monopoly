import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AccountingResultSchema = new Schema({
  key: String,
  count: Number,
  results: [Schema.Types.Mixed],
  createdAt: Number,
});

const AccountingResult = mongoose.model(
  "AccountingResult",
  AccountingResultSchema
);
export default AccountingResult;
