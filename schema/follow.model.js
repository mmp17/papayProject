const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followSchema = new mongoose.Schema(
  {
    follow_id: { type: Schema.Types.ObjectId, required: true },
    subscriber_id: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

followSchema.index({ follow_id: 1, subscriber_id: 1 }, { unique: true });
// unique index is created on the combination of follow_id and subscriber_id to ensure that each follow-subscriber relationship is unique in the collection.

module.exports = mongoose.model("Follow", followSchema);
// This schema is typically used in applications where users can follow or subscribe to other users or entities.
