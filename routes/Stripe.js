import  Express  from "express";
import Stripe from "stripe";

const StripeRouter = Express.Router()
const stripe = Stripe("sk_test_51OCIhnDdAzrFS6fm7x2Vp1Wfos7xk4mImsXk7Q1V0wYIROZYNLmSycPCnGdwmA78jVYsF44ljIaom2mQDkWrif6I00Dm3Q3jjb")


StripeRouter.post("/payment",(req,res)=>{
    
    try {
    stripe.charges.create({
        source:req.body.tokenId,
        amount:req.body.amount,
        currency:"usd"
    },( stripeErr,StripeRes)=>{
        if(stripeErr){
            res.status(500).json(stripeErr)
        } else{
            res.status(200).json(StripeRes)
        }
    });  
        
    } catch (error) {
        console.log(error);
    }
})


export default StripeRouter