// const {adminAuth,userAuth}=require("./middleware/auth")
const express = require("express");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const app = express();
const cookieParser=require("cookie-parser")
const jwt=require("jsonwebtoken")
const User = require("../src/model/user.js");
const connectDB = require("./config/database.js");
const {userAuth}=require("../middleware/auth.js")


app.use(express.json()); 
app.use(cookieParser());
app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid Credentials");
    }

    const user = await User.findOne({ emailId: emailId });
    
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    }
    //create a jwt token
    const token= jwt.sign({_id:user._id},"Ankit?710");
    //add the token to cookie and send the response back to the user
    res.cookie("token", token);
    res.send("Login successfull");
  } catch (err) { 
    res.status(400).send("Error: " + err.message);
  }
});

app.get("/profile",userAuth,async(req,res)=>{
   try{
    const user=req.user;
    // console.log(cookies)
    res.send(user);
  }catch (err) { 
    res.status(400).send("Error: " + err.message);
  }
})



connectDB()
.then(() => {
  console.log("Database connected");
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
})
.catch((err) => console.log("Database not connected", err));

