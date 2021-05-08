const { parse } = require("dotenv");
const Blog = require("../models/blog");

const blogController = {};
blogController.createBlog = async (req, res, next) => {
  try {
    const { title, description, author, genres } = req.body;
    const newBlog = new Blog({
      title,
      description,
      author,
      genres,
      owner: req.userId,
    });
    await newblog.save();
    res.status(200).json({
      status: "success",
      data: newBlog,
      message: `blog ${newBlog.title} created!`,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

blogController.getBlogs = async (req, res, next) => {
  try {
    //get query information
    let { page, limit, sortBy, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit);
    //get totale number of blogs
    const totalBlogs = await Blog.countDocuments({
      ...filter,
      isDelete: false,
    });
    //get total pages
    const totalPage = Math.ceil(totalBlogs / limit);
    //get number of data we have to skip
    const offset = limit * (page - 1);
    //get blogs base on query
    const blog = await Blog.find(filter)
      .skip(offset)
      .limit(limit)
      .populate("user")
      .populate("owner");

    const blogs = await Blog.find({}).populate("user");

    res.status(200).json({
      status: "success",
      data: blogs,
      message: `blogs are listed!`,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

blogController.getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ owner: req.userId }).populate("author");

    res.status(200).json({
      success: true,

      data: blogs,

      message: `${blogs.length} blogs found!`,
    });
  } catch (err) {
    res.status(400).json({
      success: false,

      error: err.message,
    });
  }
};
module.exports = blogController;
