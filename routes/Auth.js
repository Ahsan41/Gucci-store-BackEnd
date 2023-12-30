import  Express  from "express";
import CryptoJs from "crypto-js";
import dotenv from "dotenv";
import bcrypt  from "bcrypt"
import User from "../models/User.js";
import  Jwt  from "jsonwebtoken";



const AuthRouter = Express.Router()

//REGISTER
AuthRouter.post("/register", async (req, res) => {
  console.log(req.body);
   
    // const salt = bcrypt.genSaltSync(10);
    // const hash = bcrypt.hashSync(req.body.password, salt);  

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password:req.body.password
    });
    try {
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  AuthRouter.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({
            username: req.body.username
        });

        !user && res.status(401).json("Incorrect username or password");

        
    // const isCorrect = await bcrypt.compare(req.body.password, user.password);

    // if (!isCorrect) return res.status(403).send("wrong password");

        const isCorrect = req.body.password === user.password

        if (!isCorrect) {
            return res.status(403).json("password");
        }

        const accessToken = Jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        },
        "ahsan",
            {expiresIn:"3d"}
        );

        const { password, ...others } = user._doc;  
        res.status(200).json({...others , accessToken });

    }catch(err){  
        res.status(500).json(err.message)
    }
});

  
export default AuthRouter