const ProductModel = require("../../models/product.model.js");

class ProductManager {

    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {


            if (!title || !description || !price || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            const existeProducto = await ProductModel.findOne({ code: code })

            if (existeProducto) {
                console.log("El codigo debe ser unico")
                return;
            }

            const newProduct =  new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });

            await newProduct.save();

        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        }
    }
    async getProducts() {
        try {
            const productos = await ProductModel.find();
            return productos;
        } catch (error) {
            console.log("Error al recuperar productos", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const producto = await ProductModel.findById(id);

            if (!producto) {
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Producto encontrado");
                return producto;
            }
        } catch (error) {
            console.log("Error al buscar producto por id", error);
            throw error;
        }
    }

    async updateProduct(id, productoActualizado) {
        try {

            const updateProduct = await ProductModel.findByIdAndUpdate(id, productoActualizado);

            if (!updateProduct) {
                console.log("Producto no encontrado, vamos a morir");
                return null;
            }

            console.log("Producto actualizado: ");
            return updateProduct;


        } catch (error) {
            console.log("Error al actualizar el producto", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {

            const deleteProduct = await ProductModel.findByIdAndDelete(id);

            if (!deleteProduct) {
                console.log("Producto no encontrado, vamos a morir");
                return null;
            }

            console.log("Producto eliminado");
           
        } catch (error) {
            console.log("Error al eliminar producto", error);
            throw error;
        }
    }
}

module.exports = ProductManager;