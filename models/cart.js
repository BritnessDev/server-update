const mongoose = require("mongoose")


var cartSchema = mongoose.Schema({
    UserId: { type: String, required: false , default : 1},
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
    productName: { type: String, required: true },
    // productCategory: { type: String, required: true },
    // Availability: { type: Number, required: true },
    // status: { type: Boolean, default : true },
    Price: { type: Number, required: true },
    Quantity: { type: Number, required: true },
});

const cartModel = mongoose.model('cart', cartSchema);



module.exports = cartModel
