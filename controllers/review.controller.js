const { parse } = require("dotenv");
const Review = require("../models/review");
const Reaction = require("../models/reaction");
const Blog = require("../models/blog");
const { findByIdAndDelete } = require("../models/blog");

const reviewController = {};
reviewController.createReview = async (req, res, next) => {
  try {
    const { blog_id } = req.params;
    let blog = await Blog.findById(blog_id);

    let reviewArray = [...blog.reviews];
    const { content } = req.body;
    //create new reaction document for this review

    const newReview = new Review({
      content,
      user: req.userId,
      blog: blog_id,
    });

    await newReview.save();

    reviewArray.push(newReview._id);

    await Blog.findByIdAndUpdate(blog_id, { reviews: reviewArray });
    res.status(200).json({
      status: "success",
      data: newReview,
      message: `review ${newReview.title} created!`,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

reviewController.getReviews = async (req, res, next) => {
  try {
    //get query information
    let { page, limit, sortBy, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 5;
    //get totale number of reviews
    const totalReviews = await Review.countDocuments({
      ...filter,
    });
    //get total pages
    const totalPage = Math.ceil(totalReviews / limit);
    //get number of data we have to skip
    const offset = limit * (page - 1);
    //get reviews base on query
    const reviews = await Review.find(filter)
      .skip(offset)
      .limit(limit)
      .populate("user");

    // const reviews = await Review.find({}).populate("user");

    res.status(200).json({
      status: "success",
      data: reviews,
      page,
      totalPage,
      message: `reviews are listed!`,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

// reviewController.getMyReviews = async (req, res) => {
//   try {
//     const reviews = await Review.find({ owner: req.userId }).populate("author");

//     res.status(200).json({
//       success: true,

//       data: reviews,

//       message: `${reviews.length} reviews found!`,
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,

//       error: err.message,
//     });
//   }
// };

reviewController.deleteReview = async (req, res) => {
  try {
    const { review_id } = req.params;

    const review = await Review.findById(review_id);
    const blog = await Blog.findById(review.blog);

    let reviewsArray = blog.reviews;
    let index = reviewsArray.indexOf(review_id);
    if (index != -1) {
      reviewsArray.splice(index, 1);
    }

    if (req.userId == review.user) {
      await Blog.findByIdAndUpdate(
        review.blog,
        { reviews: reviewsArray },
        { new: true }
      );
      await Review.findByIdAndDelete(review_id);
    }
    res.status(200).json({
      status: "success",

      message: `review is deleted!`,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
reviewController.updateReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const { content } = req.body;
    const review = await Review.findById(review_id);

    console.log(review.user);
    console.log(req.userId);
    if (req.userId == review.user) {
      await Review.findByIdAndUpdate(review_id, { content }, { new: true });
      res.status(200).json({
        status: "success",

        message: `review is updated!`,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
module.exports = reviewController;
