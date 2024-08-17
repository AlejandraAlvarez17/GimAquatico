const express = require("express");
const router = express.Router();
const CartManager = require("../controller/cart-manager.js");
const cartManager = new CartManager("./src/models/carts.json");

// se crea un nuevo carrito

router.post("/", async( req,res) => {
    try {
        const newcart = await cartManager.crearCart();
        res.json(newCart);

    }catch ( error){
        console.error("Error al crear un nuevo carrito",error);
        res.status(500).json({error:"Error interno del servidor"});

    }
});

//lista de productos de determinado carritos
router.get("/:cid", async(req,res)=>{
    const cartId = parseInt(req.params.cid);

    try {
        const cart = await cartManager.getCarritoById(cartId);
        res.json(cart.products);

    }catch (error) {
        console.error("Error al obtener el carrito",error);
        res.status(500).json({error:"Error interno del servidor"});
    }
});

//Agregar porductos a distintos carritos

router.post("/:cid/product/:pid", async(req,res)=> {
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try{
        const actualizarCart = await cartManager.agregarProductoAlCarrito;
        res.json(actualizarCarrito.products);

    } catch (error) {
        console.error("Error al agregar producto al carrito",error);
        res.status(500).json({error: "Error interno del servidor"});
    }

});
module.exports = router;

