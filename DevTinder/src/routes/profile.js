const express = require("express");
const { userAuth } = require("../middleware/auth.js");
const { validateEditProfileData } = require("../utils/validation.js");
const validator = require("validator");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    // console.log(cookies)
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
      //return res.status(400).send("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
     await loggedInUser.save(); 
    res.json({
        message:`${loggedInUser.firstName}, Your Profile Updated Successfuly`,
        data:loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error:  " + err.message);
  }
});
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const newPassword=req.body.password;
    const loggedInUser = req.user;
    if(!validator.isStrongPassword(newPassword)){
      throw new Error("New password is not strong enough")
    }

    loggedInUser.password=newPassword

     await loggedInUser.save(); 
    res.json({
        message:`${loggedInUser.firstName}, Your Password updated successfuly`,
        data:loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error:  " + err.message);
  }
});
module.exports = profileRouter;
