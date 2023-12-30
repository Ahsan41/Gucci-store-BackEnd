import Product from "../models/Product.js"
import Express from "express"
import { verifyTokenAndAdmin } from "./VerifyToken.js"

const ProductRouter = Express.Router()

//  Create a new product

ProductRouter.post("/", verifyTokenAndAdmin, async (req, res) => {
    const CreateProduct = await Product(req.body)

    try {
        const newproduct = await CreateProduct.save();
        res.status(200).json(newproduct)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

//  Update a new Products

ProductRouter.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedProduct);

    } catch (err) {
        console.log(err.message);
        res.status(500).json(err.message || "internal server error");
    }
});

//  delete a product

ProductRouter.delete("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("the product has been deleted")
    } catch (error) {
        res.status(500).json(err.message || "internal server error");
    }
})

//   get a Product

ProductRouter.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        console.log(err.message);
        res.status(500).json(err.message || "internal server error");
    }
});

//   get All Products

ProductRouter.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
    let products;

    if (qNew) {
        products = Product.find().sort({ createdAt: -1 }).limit(1)
    } else if (qCategory) {
        products = await Product.find({
            categories: {
                $in: [qCategory],
            },
        })
    } else {
        products = await Product.find();
    }
    res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error);
    }
})


export default ProductRouter