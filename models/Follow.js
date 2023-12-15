const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config.js");
const Definer = require("../lib/mistake");
const FollowModel = require("../schema/follow.model");
const MemberModel = require("../schema/member.model");

class Follow {
  constructor() {
    this.followModel = FollowModel;
    this.memberModel = MemberModel;
  }

  async subscribeData(member, data) {
    // Validates that a member is not trying to follow themselves, converts IDs to MongoDB ObjectIds, checks if the follow target exists, creates a new subscription, and updates the follow and subscriber counts of the involved members.
    try {
      assert.ok(member._id !== data.mb_id, Definer.follow_err1);

      const subscriber_id = shapeIntoMongooseObjectId(member._id);
      const follow_id = shapeIntoMongooseObjectId(data.mb_id);

      const member_data = await this.memberModel
        .findById({ _id: follow_id })
        .exec();
      assert.ok(member_data, Definer.general_err2);

      const result = await this.createSubscriptionData(
        follow_id,
        subscriber_id
      );
      assert.ok(result, Definer.general_err1);

      await this.modifyMemberFollowCounts(follow_id, "subscriber_change", 1);
      await this.modifyMemberFollowCounts(subscriber_id, "follow_change", 1);
      return true;
    } catch (err) {
      throw err;
    }
  }

  async unsubscribeData(member, data) {
    try {
      const subscriber_id = shapeIntoMongooseObjectId(member._id),
        follow_id = shapeIntoMongooseObjectId(data.mb_id),
        result = await this.followModel.findOneAndDelete({
          follow_id,
          subscriber_id,
        });
      assert.ok(result, Definer.general_err1);

      await this.modifyMemberFollowCounts(follow_id, "subscriber_change", -1);
      await this.modifyMemberFollowCounts(subscriber_id, "follow_change", -1);
      return true;
    } catch (err) {
      throw err;
    }
  }

  async createSubscriptionData(follow_id, subscriber_id) {
    // Creates a new follow relationship between two members and saves it to the database.
    try {
      const new_follow = new this.followModel({
        follow_id: follow_id,
        subscriber_id: subscriber_id,
      });
      return await new_follow.save();
    } catch (err) {
      console.log(mongo_err);
      throw new Error(Definer.follow_err2);
    }
  }

  async modifyMemberFollowCounts(mb_id, type, modifier) {
    // Updates the follow or subscriber count of a member based on the provided type and modifier.
    try {
      if (type === "follow_change") {
        await this.memberModel
          .findByIdAndUpdate(
            { _id: mb_id },
            { $inc: { mb_follow_cnt: modifier } }
          )
          .exec();
      } else if (type === "subscriber_change") {
        await this.memberModel
          .findByIdAndUpdate(
            { _id: mb_id },
            { $inc: { mb_subscriber_cnt: modifier } }
          )
          .exec();
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Follow;

// designed to manage follow and subscription functionalities in a Node.js application using MongoDB.
