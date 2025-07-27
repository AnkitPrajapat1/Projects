const express=require("express");
const { userAuth } = require("../middleware/auth.js");

const requestRouter=express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("Sending connection reequest");
  res.send(user.firstName + " send connection request!");
});

module.exports=requestRouter;