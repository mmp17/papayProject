const mongoose = require("mongoose");

exports.member_type_enums = ["USER", "ADMIN", "PEDAL", "RESTAURANT"];
exports.member_status_enums = ["ONPAUSE", "ACTIVE", "DELETED"];
// deleted (soft delete, where the record is marked as deleted but not actually removed).
exports.ordinary_enums = ["Y", "N"];
// boolean equivalent, where "Y" stands for 'Yes' and "N" for 'No'.

exports.product_collection_enums = ["dish", "salad", "dessert", "drink", "etc"];
// Products can be categorized as a dish, salad, dessert, drink, or some other category ("etc").
exports.product_status_enums = ["PAUSED", "PROCESS", "DELETED"];
exports.product_size_enums = ["Small", "Normal", "Large", "Set"];
exports.product_volume_enums = [0.5, 1, 1.2, 1.5, 2];
// These enumerated values ensure consistency across the application and prevent invalid data from being entered. For example, when creating a new product, one might check that the provided size is one of the values in product_size_enums. If it's not, the application can reject the input or inform the user of the valid options.

exports.order_status_enums = ["PAUSED", "PROCESS", "FINISHED", "DELETED"];

exports.like_view_group_list = ["product", "member", "community"];
exports.board_id_enum_list = ["celebrity", "evaluation", "story"];
exports.board_article_status_enum_list = ["active", "deleted"];

// MongoDB related commands
exports.shapeIntoMongooseObjectId = (target) => {
  if (typeof target === "string") {
    return new mongoose.Types.ObjectId(target);
  } else return target;
};

// designed to be a part of a MongoDB aggregation pipeline, specifically the $lookup stage
//function is aimed at joining data from a "follows" collection to another dataset based on certain conditions
// It is meant to determine if the authenticated member (identified by mb_id) is following other members.
exports.lookup_auth_member_following = (mb_id, origin) => {
  const follow_id = origin === "follows" ? "$subscriber_id" : "$_id";
  return {
    $lookup: {
      // The function constructs a $lookup stage for an aggregation pipeline. $lookup is used to perform a left outer join to another collection in the same database to filter in documents from the "joined" collection for processing.
      from: "follows",
      let: {
        // the let clause is used to declare variables.
        lc_follow_id: follow_id,
        lc_subscriber_id: mb_id,
        nw_my_following: true,
      },
      pipeline: [
        // The pipeline array defines a sequence of stages to be executed on the "follows" collection.
        {
          $match: {
            // $match stage uses $expr to allow the use of aggregation expressions within the query. It matches documents in the "follows" collection where the follow_id is equal to lc_follow_id and subscriber_id is equal to lc_subscriber_id.
            $expr: {
              $and: [
                { $eq: ["$follow_id", "$$lc_follow_id"] },
                { $eq: ["$subscriber_id", "$$lc_subscriber_id"] },
              ],
            },
          },
        },
        {
          $project: {
            // $project stage specifies the fields to include or exclude. It sets _id to 0 (excluded), includes subscriber_id and follow_id, and adds a new field my_following set to the value of nw_my_following.
            _id: 0,
            subscriber_id: 1,
            follow_id: 1,
            my_following: "$$nw_my_following",
          },
        },
      ],
      as: "me_followed",
      // The joined data is outputted in a field named "me_followed" in the resulting documents of the aggregation pipeline
    },
  };
};

// This function is useful for identifying relationships between members in a platform, such as checking if a user is following certain other users.
// It demonstrates a more complex use of the $lookup stage with a pipeline for fine-grained control over the join.

exports.lookup_auth_member_liked = (mb_id) => {
  return {
    $lookup: {
      from: "likes",
      let: {
        lc_liken_item_id: "$_id",
        lc_mb_id: mb_id,
        nw_my_favourite: true,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$like_ref_id", "$$lc_liken_item_id"] },
                { $eq: ["$mb_id", "$$lc_mb_id"] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            mb_id: 1,
            like_ref_id: 1,
            my_favorite: "$$nw_my_favourite",
          },
        },
      ],
      as: "me_liked",
    },
  };
};
