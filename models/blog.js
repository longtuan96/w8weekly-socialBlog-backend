const mongoose = require("mongoose");
const User = require("./user");
const blogSchema = mongoose.Schema({
  title: {
    type: String,

    required: [true, "title is required"],

    trim: true,
  },

  content: {
    type: String,

    required: [true, "content is required"],

    trim: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User",
  },
});

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
