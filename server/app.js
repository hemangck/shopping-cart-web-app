// importing required modules and files
const express = require("express");
const cors = require("cors");
const products = require("./data/products.json")

// initializing express app
const app = express();

// using middlewares
app.use(cors());
app.use(express.json());

// getting port 
const PORT = process.env.PORT || 3000;

// testing port
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

// writing api routes

// api route to display list of products
app.get("/products", (req, res) => {
    res.json(products);
})

// api route for checkout operation
app.post("/checkout", (req, res) => {
    
    // getting data from request
    const data = req.body;

    // printing cart data to console
    console.log(data);

    // sending success message to frontend
    res.send({
        "message": "Order Placed Successfully !"
    })

});

