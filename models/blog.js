const mongoose = require("mongoose");
const User = require("./user");
const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,

      required: [true, "title is required"],

      trim: true,
    },
    reviewCount: { type: Number, default: 0 },
    content: {
      type: String,

      required: [true, "content is required"],

      trim: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",
    },
    images: { type: Array },
    reactions: {
      type: Object,
      default: { laugh: 0, sad: 0, like: 0, love: 0, angry: 0 },
    },

    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  {
    timestamps: true,
  }
);

blogSchema.pre("save", async function (next) {
  // check the user is exist in system
  const checkUser = await User.findById(this.author);
  if (checkUser) {
    next();
  } else {
    throw new Error("that user is not exist");
  }
});
const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
