const express = require("express");
const router = express.Router();
const ProductManager = require("../controller/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");



router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        const product = await productManager.getProducts();
        if (limit) {
            const nuevoArrayRecortado = product.slice(0, limit)
            res.json(nuevoArrayRecortado);
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" })

    }
})

router.get("/:pid", async (req,res) => {
    try{
        let id = req.params.pid;
        const product = await productManager.getProductById(parseInt(id));
        if(!product){
            return res.json({error:"ID no encontrado"});
        }
        res.json(product);
    } catch(error){
        res.status(500).json({error: "Error interno del servidor"})
    }

})


module.exports = router; 