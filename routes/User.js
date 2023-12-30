import  Express  from "express";
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from "./VerifyToken.js";
import User from "../models/User.js"

const UserRouter = Express.Router()

UserRouter.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
      // Assuming req.user is set by verifyToken middleware
      if (req.user.id === req.params.id || req.user.isAdmin) {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        res.status(200).json(updatedUser);
      } else {
        res.status(403).json("You are not allowed to do that!");
      }
    } catch (err) {
        console.log(err.message);
      res.status(500).json(err.message || "internal server error");
    }
  });

  UserRouter.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
     
       await User.findByIdAndDelete(req.params.id);
        res.status(200).json("user has been deleted ...");   
    } catch (err) {
        console.log(err.message);
      res.status(500).json(err.message || "internal server error");
    }
  });

  UserRouter.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
      const user =  await User.findById(req.params.id);
      const { password, ...others } = user._doc;  
      res.status(200).json(others);
    } catch (err) {
        console.log(err.message);
      res.status(500).json(err.message || "internal server error");
    }
  });

  UserRouter.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
      const users = query
      ? await User.find().sort({ _id:-1 }).limit(2)
      : await User.find();
       res.status(200).json(users);
    } catch (err) {
        console.log(err.message);
      res.status(500).json(err.message || "internal server error");
    }
  });
 
  //GET USER STATS

UserRouter.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err);
  }
});
   


export default UserRouter