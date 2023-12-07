const assert = require("assert");
const Definer = require("../lib/mistake.js");
const MemberModel = require("../schema/member.model.js");
const { shapeIntoMongooseObjectId } = require("../lib/config.js");
const Member = require("./Member.js");

class Restaurant {
  constructor() {
    this.memberModel = MemberModel;
  }

  async getRestaurantsData(member, data) {
    // The method is designed to fetch and return a list of restaurants based on specific criteria and includes pagination, random sampling, and sorting capabilities.
    try {
      const auth_member_id = shapeIntoMongooseObjectId(member?._id);
      let match = { mb_type: "RESTAURANT", mb_status: "ACTIVE" };
      let aggregationQuery = [];
      data.limit = data["limit"] * 1;
      data.page = data["page"] * 1;

      switch (data.order) {
        case "top":
          match["mb_top"] = "Y";
          aggregationQuery.push({ $match: match });
          aggregationQuery.push({ $sample: { size: data.limit } });
          break;
        case "random":
          aggregationQuery.push({ $match: match });
          aggregationQuery.push({ $sample: { size: data.limit } });
          break;
        default:
          aggregationQuery.push({ $match: match });
          const sort = { [data.order]: -1 };
          aggregationQuery.push({ $sort: sort });
          break;
      }

      aggregationQuery.push({ $skip: (data.page - 1) * data.limit });
      aggregationQuery.push({ $limit: data.limit });
      // todo: check if auth member liked the chosen target

      const result = await this.memberModel.aggregate(aggregationQuery).exec();
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenRestaurantData(member, id) {
    // method retrieves data for a specified restaurant by its ID. This function ensures that only active restaurant data is fetched and handles member interactions as well.
    try {
      id = shapeIntoMongooseObjectId(id); // Converts the id parameter into a Mongoose ObjectId.

      if (member) {
        // If a member is provided, it creates a Member instance and records the member's view of the chosen restaurant.
        const member_obj = new Member();
        await member_obj.viewChosenItemByMember(member, id, "member");
      }

      const result = await this.memberModel
        // Queries the memberModel (schema model) for a single document with the provided id and a status of "ACTIVE".
        .findOne({
          _id: id,
          mb_status: "ACTIVE",
        })
        .exec();
      assert.ok(result, Definer.general_err2);
      // Asserts that a result was obtained; if not, it throws an error defined by Definer.general_err2.

      return result; // Returns the result of the query.
    } catch (err) {
      throw err;
    }
  }

  async getAllRestaurantsData() {
    try {
      let result = await this.memberModel
        .find({
          mb_type: "RESTAURANT",
        })
        .exec();

      assert(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateRestaurantByAdmin(update_data) {
    try {
      const id = shapeIntoMongooseObjectId(update_data?.id);
      const result = await this.memberModel
        .findByIdAndUpdate({ _id: id }, update_data, {
          runValidators: true,
          lean: true,
          returnDocument: "after",
        })
        .exec();
      assert(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Restaurant;
