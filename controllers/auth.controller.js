const User = require("../models/user");
const bcrypt = require("bcrypt");
const authController = {};

authController.loginWithEmail = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({
      success: false,
      error: "Wrong email or password",
    });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({
      success: false,

      error: "Wrong email or password",
    });

  const accessToken = await user.generateToken();
  console.log(accessToken);
  res.status(200).json({
    success: true,
    data: { user },
    accessToken,
    message: `Logged in successfully!`,
  });
};
module.exports = authController;
