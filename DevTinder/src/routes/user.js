const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/user");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

//get all the pending request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    //.populate("fromUserId",["firstName","lastName"]);
    res.json({ message: "Data fetched successfuly", data: connectionRequest });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    console.log(connectionRequest);
    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      acc;
      return row.fromUserId;
    });
    res.json({ data: data });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const page=parseInt(req.query.page) || 1;
    let limit=parseInt(req.query.limit) || 10;
     limit=limit>50?50:limit;
    const skip=(page-1)*limit;
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hidUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hidUsersFromFeed.add(req.fromUserId.toString()),
        hidUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and:[
      { _id: { $nin: Array.from(hidUsersFromFeed) } },
      { _id: { $ne: loggedInUser._id } },
    ],
  }).select(USER_SAFE_DATA).skip(skip).limit(limit);
    res.send(users);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
    console.log(err.message);
  }
});

module.exports = userRouter;
