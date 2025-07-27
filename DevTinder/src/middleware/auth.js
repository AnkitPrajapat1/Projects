const jwt=require("jsonwebtoken");
const User=require("../model/user");

const userAuth=async(req,res,next)=>{
 try{

  const cookies=req.cookies;
  const {token}=cookies;
  if(!token){
    throw new Error("Token is not valid")
  }  

  const decodedObj= jwt.verify(token,"Ankit?710");
  const {_id}=decodedObj;
  const user=await User.findById(_id);
  if(!user){
    throw new Error("User not found");
  }
  req.user=user;
  next();

 }catch(err){
  res.status(400).send("Error: "+err.message);
 }
}

module.exports={userAuth}