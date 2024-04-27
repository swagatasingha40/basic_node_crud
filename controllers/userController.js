const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !password || !email) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("user already registered");
  }
  //Hash Pass
  const hashPass = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashPass,
  });

  console.log(user);
  if (user) {
    res.status(201).json({ _id: user.id, emailAddress: user.email });
  } else {
    res.status(400);
    throw new Error("User data not valid");
  }
});

//@desc login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("all fields are mandatory");
  }
  const user = await User.findOne({ email });
  //compare pass with hash pass
  if (user && (await bcrypt.compare(password, user.password))) {
    const accesToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accesToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

//@desc current user info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = {
  registerUser,
  currentUser,
  loginUser,
};
