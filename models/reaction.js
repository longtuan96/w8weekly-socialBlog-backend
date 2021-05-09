const mongoose = require("mongoose");

const reactionSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author is required"],
  },
  targetType: {
    type: String,
    required: [true, "Target type is required"],
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Target ID is required"],
  },
  emoji: {
    type: String,
    required: [true, "Target ID is required"],
  },
});

const Reaction = mongoose.model("Reaction", reactionSchema);

module.exports = Reaction;
