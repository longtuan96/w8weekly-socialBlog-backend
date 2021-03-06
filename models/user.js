const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User must have a name"],
      trim: true,
      minLength: 3,
    },
    email: {
      type: String,
      required: [true, "User must have an email"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "User must have a password"],
    },
    avatarUrl: { type: String },
    friendCount: { type: Number, default: 0 },
    friendShip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FriendShip",
    },
    reviews: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
    blogs: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
    reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reaction" }],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.__v;

  return obj;
};

userSchema.methods.generateToken = function () {
  const user = this;
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});
userSchema.statics.findOrCreate = function findOrCreate(profile, cb) {
  const userObj = new this();
  this.findOne({ email: profile.email }, async function (err, result) {
    if (!result) {
      let newPassword = "" + Math.floor(Math.random() * 100000000);
      const salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(newPassword, salt);

      userOnj.name = profile.name;
      userObj.mail = profile.mail;
      (userObj.password = newPassword), (userObj.avatarUrl = profile.avatarurl);

      await userObj.save(cb);
    } else {
      cb(err, result);
    }
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
