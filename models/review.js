const mongoose = require("mongoose");
const User = require("./user");
const reviewSchema = mongoose.Schema(
  {
    content: {
      type: String,

      required: [true, "content is required"],

      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Blog",
    },

    reactions: {
      type: Object,
      default: { laugh: 0, sad: 0, like: 0, love: 0, angry: 0 },
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.pre("save", async function (next) {
  // check the user is exist in system
  const checkUser = await User.findById(this.user);
  if (checkUser) {
    next();
  } else {
    throw new Error("that user is not exist");
  }
});
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
