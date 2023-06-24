const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../middleware/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new Error("email already registered");
  } else {
    let newUser = new User({
      name,
      email,
      password,
      pic,
    });

    newUser = await newUser.save();
    if (newUser) {
      res.json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        pic: newUser.pic,
        token: `Bearer ${generateToken(newUser._id)}`,
      });
    } else {
      throw new Error("failed to create the user");
    }
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: `Bearer ${generateToken(user._id)}`,
    });
  } else {
    throw new Error("no user found");
  }
});

  const getAllUsers = asyncHandler(async (req, res) => {
    const keyWord = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyWord).find({ _id: { $ne: req.user._id } });
    res.send(users); 
  });

module.exports = { registerUser, loginUser, getAllUsers };
