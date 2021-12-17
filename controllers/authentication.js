const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpire } = require("../environment/keys");

exports.registerUserController = async (req, res) => {

  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      console.log("Email already exists");
      return res.status(400).json({
        errorMessage: "Email already exists",
      });
    } else {
      console.log("Successful Signing up");

      const newUser = new User(); // create a new user

      newUser.firstname = firstName;
      newUser.lastname = lastName;
      newUser.email = email;

      const salt = await bcrypt.genSalt(10);

      newUser.password = await bcrypt.hash(password, salt);

      await newUser.save(); // save to db

      return res.status(201).json({
        successMessage: "Registration success . Please signin.",
      });
    }
  } catch (err) {
    console.log("signupController error: ", err);
    
    return res.status(500).json({
      errorMessage: "Server error",
    });
  }
};

exports.loginUserController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Invalid credentials");
      return res.status(404).json({
        errorMessage: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid credentials");
      return res.status(400).json({
        errorMessage: "Invalid credentials",
      });
    }

    const payload = {
      user: {
        _id: user._id,
      },
    };

    await jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: jwtExpire },
      (err, token) => {
        if (err) console.log("Token error", err);
        const { _id, username, email } = user;

        res.json({
          token,
          user: { _id, username, email},
        });
      }
    );

    console.log("Signed in");
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      errorMessage: "Server error",
    });
  }
};
