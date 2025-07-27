const express=require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../model/user");
const cookieParser = require("cookie-parser");
const { validateSignUpData } = require("../utils/validation");

const authRouter=express.Router();

authRouter.use(express.json());
authRouter.use(cookieParser());



authRouter.post("/signup", async (req, res) => {
  try {
    //validaation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    //Encrypting password
    const passwordHash = await bcrypt.hash(password, 10);
    // const userObj = req.body;

    //creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("user added");
  } catch (error) {
    res.status(400).send("error adding user:" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid Credentials");
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password)
    if (isPasswordValid) {
      //create a jwt token
      const token = await user.getJWT();
      //add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 3600000), // cookie will be removed after 8 hours
      });
      res.send("Login successfull");
    } else { 
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/logout",async(req,res)=>{ 
    res.cookie("token",null,{
        expires:new Date(Date.now())
    })
    res.send("LogOut is successfull!!")  
})
module.exports=authRouter;