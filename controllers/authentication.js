const User = require("../models/User");
const { jwtSecret, jwtExpire } = require("../environment/keys");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.registerUserController = async (req, res) => {

  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      console.log("Email Exists !!");
      return res.status(400).json({
        errorMessage: "Email Exists !",
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
        successMessage: "Registration success !!",
      });
    }
  } catch (err) {
    console.log("signupController error: ", err);
    
    return res.status(500).json({
      errorMessage: "Internal Server Error",
    });
  }
};

exports.loginUserController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Wrong Credentials");
      return res.status(404).json({
        errorMessage: "Wrong Credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Wrong credentials");
      return res.status(400).json({
        errorMessage: "Wrong credentials",
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
