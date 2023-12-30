import  Express  from "express";
import dotenv from "dotenv";
import cors from "cors"
import mongoose from "mongoose";
import AuthRouter from "./routes/Auth.js";
import UserRouter from "./routes/User.js";
import ProductRouter from "./routes/Product.js";
import CartRouter from "./routes/Cart.js";
import OrderRouter from "./routes/Order.js";
import StripeRouter from "./routes/Stripe.js";

const port = 5000;
const app = Express()

app.use(cors());

const url = "mongodb+srv://ahsanazeem706:lW8gWsXbpEAIR6C2@cluster0.adrk3s1.mongodb.net/"

const connect = () => {
    mongoose
    .connect(url)
    .then(() => {
        console.log(`connected to DB`);
    })
    .catch((err) => {
        console.log(err);
        throw err;
    });
}; 

app.use(Express.json())
app.use("/auth", AuthRouter)
app.use("/user", UserRouter )
app.use("/product" , ProductRouter)
app.use("/cart", CartRouter)
app.use("/order", OrderRouter)
app.use("/checkout" , StripeRouter)



app.listen(port,()=>{
    connect();
    console.log("Backend server");
});



// lW8gWsXbpEAIR6C2