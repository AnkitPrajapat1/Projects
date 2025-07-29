const express = require("express");
const { userAuth } = require("../middleware/auth.js");
const ConnectionRequest = require("../model/connectionRequest");
const User=require("../model/user.js")
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const isValidStatus = ["ignored", "interested"];

      if (!isValidStatus.includes(status)) {
        throw new Error("Invalid Status type");
      }
      if(fromUserId==toUserId){
        throw new Error("You cant send request to yourself")
      }
      const isUser= await User.findById(toUserId);
      if(!isUser){
        throw new Error("User not found");
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if( existingConnectionRequest){
        return res.status(400).send({message:"connection request already exit!!"})
      }
      const connectionRequest = await new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: req.user.firstName+ (status=="interested"?` is interested in `:" ignored ")+isUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

module.exports = requestRouter;
