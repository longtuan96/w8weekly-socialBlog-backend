const { parse } = require("dotenv");
const e = require("express");
const Blog = require("../models/blog");
const Reaction = require("../models/reaction");

const blogController = {};
blogController.createBlog = async (req, res, next) => {
  try {
    const { title, content, images } = req.body;
    //create new reaction document for this blog
    const imagesArray = [...images];
    const newBlog = new Blog({
      title,
      content,
      images: imagesArray,
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
    });
    //get total pages
    const totalPage = Math.ceil(totalBlogs / limit);
    //get number of data we have to skip
    const offset = limit * (page - 1);
    //get blogs base on query
    const blogs = await Blog.find(filter)
      .skip(offset)
      .limit(limit)
      .populate("author");
    // const blogs = await Blog.find({}).populate("author");

    res.status(200).json({
      status: "success",
      data: blogs,
      page,
      totalPage,
      totalBlogs,
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
    const blogs = await Blog.find({ author: req.userId }).populate("author");

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
    const blog = await Blog.find({ _id: req.params.blog_id })
      .populate("author")
      .populate("reviews");

    res.status(200).json({
      success: true,

      data: blog,

      message: ` blog ${req.params.blog_id} found!`,
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
      res.status(200).json({
        success: true,

        data: blog,

        message: `blog deleted `,
      });
    } else {
      res.status(400).json({
        success: "fail",

        message: `you are not the author`,
      });
    }
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
    const imagesArray = [...images];
    const oldBlog = await Blog.findById(req.params.blog_id);
    const blog = await Blog.findById(req.params.blog_id);
    const editTitle = title || oldBlog.title;
    const editContent = content || oldBlog.content;
    const editImages = imagesArray || oldBlog.images;
    if (req.userId == blog.author) {
      await Blog.findByIdAndUpdate(
        req.params.blog_id,
        { title: editTitle, content: editContent, images: editImages },
        { new: true }
      );
      res.status(200).json({
        success: true,

        message: `${blog._id} is updated `,
      });
    } else {
      es.status(400).json({
        success: "fail",

        message: `you are not the author `,
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,

      error: err.message,
    });
  }
};
module.exports = blogController;
