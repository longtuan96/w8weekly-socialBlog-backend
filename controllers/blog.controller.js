const { parse } = require("dotenv");
const Blog = require("../models/blog");
const Reaction = require("../models/reaction");

const blogController = {};
blogController.createBlog = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    //create new reaction document for this blog

    const newBlog = new Blog({
      title,
      content,
      author: req.userId,
    });

    await newBlog.save();

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
    limit = parseInt(limit) || 5;
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

    const blogs = await Blog.find({}).populate("owner");

    res.status(200).json({
      status: "success",
      data: blogs,
      page,
      totalPage,
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
blogController.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.find({ _id: req.params.blog_id }).populate(
      "author"
    );

    res.status(200).json({
      success: true,

      data: blog,

      message: `${blogs.length} blogs found!`,
    });
  } catch (err) {
    res.status(400).json({
      success: false,

      error: err.message,
    });
  }
};
blogController.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blog_id);

    if (req.userId == blog.author) {
      await Blog.findByIdAndDelete(blog._id);
    }

    res.status(200).json({
      success: true,

      data: blog,

      message: `blog deleted `,
    });
  } catch (err) {
    res.status(400).json({
      success: false,

      error: err.message,
    });
  }
};
blogController.updateBlog = async (req, res) => {
  try {
    const { title, content, images } = req.body;
    const oldBlog = await Blog.findById(req.params.blog_id);
    const blog = await Blog.findById(req.params.blog_id);
    const editTitle = title || oldBlog.title;
    const editContent = content || oldBlog.content;
    const editImages = images || oldBlog.images;
    if (req.userId == blog.author) {
      await Blog.findByIdAndUpdate(
        req.params.blog_id,
        { title: editTitle, content: editContent, images: editImages },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,

      message: `${blog._id} is updated `,
    });
  } catch (err) {
    res.status(400).json({
      success: false,

      error: err.message,
    });
  }
};
module.exports = blogController;
