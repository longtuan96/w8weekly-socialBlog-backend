const Blog = require("../models/blog");
const Reaction = require("../models/reaction");
const Review = require("../models/review");
const User = require("../models/user");

const reactionController = {};

reactionController.chooseReaction = async (req, res, next) => {
  try {
    const { targetType, targetId, emoji } = req.body;
    let target = "";

    //if there no same reaction from this user
    console.log(targetId);
    const currentReaction = await Reaction.findOne({
      author: req.userId,
      targetId,
    });
    if (!currentReaction) {
      console.log("if run");
      const reaction = await new Reaction({
        author: req.userId,
        targetType,
        targetId,
        emoji,
      });
      await reaction.save();

      let update = "";
      switch (emoji) {
        case "laugh":
          update = { $inc: { "reactions.laugh": 1 } };
          break;
        case "sad":
          update = { $inc: { "reactions.sad": 1 } };
          break;
        case "like":
          update = { $inc: { "reactions.like": 1 } };
          break;
        case "love":
          update = { $inc: { "reactions.love": 1 } };
          break;
        case "angry":
          update = { $inc: { "reactions.angry": 1 } };
          break;
        default:
          break;
      }
      if (targetType == "Blog") {
        target = await Blog.findByIdAndUpdate(targetId, update, { new: true });
      } else if (targetType == "Review") {
        target = await Review.findById(targetId, update, { new: true });
      }
    } else if (currentReaction && emoji == currentReaction.emoji) {
      let update = "";
      switch (emoji) {
        case "laugh":
          update = { $inc: { "reactions.laugh": -1 } };
          break;
        case "sad":
          update = { $inc: { "reactions.sad": -1 } };
          break;
        case "like":
          update = { $inc: { "reactions.like": -1 } };
          break;
        case "love":
          update = { $inc: { "reactions.love": -1 } };
          break;
        case "angry":
          update = { $inc: { "reactions.angry": -1 } };
          break;
        default:
          break;
      }

      if (targetType == "Blog") {
        target = await Blog.findByIdAndUpdate(targetId, update, { new: true });
      } else if (targetType == "Review") {
        target = await Review.findOneAndUpdate(targetId, update, { new: true });
      }
      await Reaction.findByIdAndDelete(currentReaction._id);
    } else if (currentReaction && emoji != currentReaction.emoji) {
      await Reaction.findByIdAndUpdate(currentReaction._id, { emoji });
      let updateFirst = "";
      let updateSecond = "";
      switch (currentReaction.emoji) {
        case "laugh":
          updateFirst = { $inc: { "reactions.laugh": -1 } };
          break;
        case "sad":
          updateFirst = { $inc: { "reactions.sad": -1 } };
          break;
        case "like":
          updateFirst = { $inc: { "reactions.like": -1 } };
          break;
        case "love":
          updateFirst = { $inc: { "reactions.love": -1 } };
          break;
        case "angry":
          updateFirst = { $inc: { "reactions.angry": -1 } };
          break;
        default:
          break;
      }
      if (targetType == "Blog") {
        target = await Blog.findByIdAndUpdate(targetId, updateFirst, {
          new: true,
        });
      } else if (targetType == "Review") {
        target = await Review.findOneAndUpdate(targetId, updateFirst, {
          new: true,
        });
      }
      switch (emoji) {
        case "laugh":
          updateSecond = { $inc: { "reactions.laugh": 1 } };
          break;
        case "sad":
          updateSecond = { $inc: { "reactions.sad": 1 } };
          break;
        case "like":
          updateSecond = { $inc: { "reactions.like": 1 } };
          break;
        case "love":
          updateSecond = { $inc: { "reactions.love": 1 } };
          break;
        case "angry":
          updateSecond = { $inc: { "reactions.angry": 1 } };
          break;
        default:
          break;
      }
      if (targetType == "Blog") {
        target = await Blog.findByIdAndUpdate(targetId, updateSecond, {
          new: true,
        });
      } else if (targetType == "Review") {
        target = await Review.findOneAndUpdate(targetId, updateSecond, {
          new: true,
        });
      }
    }

    res.status(200).json({
      status: "success",

      message: "new reaction added",
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports = reactionController;
