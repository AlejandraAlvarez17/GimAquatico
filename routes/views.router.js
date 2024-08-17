const express = require("express");
const router = express.Router(); 

router.get("/login", (req, res) => {
    res.render("login"); 
})

router.get("/register", (req, res) => {
    res.render("register");
})

// const ProductManager = require("../controller/product-manager.js");
// const productManager = new productManager("./src/models/products.json");


// router.get("/", async (req, res) => {
//     res.render("chat");
// })


// router.get("/",async (req, res) => {
//     try{
//         const product = await productManager.getProducts();
//         res.render("home", {productManager})
//     }catch (error){
//         console.log("error al obtener los prpoductos",error)
//             res.status(500).json({error:"Error interno del servidor"});
//         }
//     })
    

// router.get("realtimeproducts",async( req,res) => { 
//     try {
//         res.render(realtimeproducts);
//     } catch (error){
//         console.log("cuando se actualizen los productos")

//     }

// })
module.exports = router; 