const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            }, 
            quantity: {
                type: Number,
                required: true
            },
        },
        { _id: false }
    ]
});
cartSchema.pre("findOne", function () {
    this.populate("products.product", "_id title price thumbnail stock category");
  });

const CartModel = mongoose.model("carts", cartSchema);

module.exports = CartModel;