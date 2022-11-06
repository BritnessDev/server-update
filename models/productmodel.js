const mongoose = require("mongoose")



// const productSchema = mongoose.Schema({
//     productName: { type: String, required: true },
//     productCategory: { type: mongoose.Schema.Types.ObjectId, ref: "categories" , required: false },
//     status: { type: Boolean, default : true },
//     Price: { type: Number, required: true },
//     Quantity: { type: String, required: true },
//     Productimg : {type : String , required : true},
//     ProductDetails : {type : String , required : true}

// })

const productSchema = mongoose.Schema({
    productName: { type: String, required: true },
    productCategory: { type: String, required: true },
    // Availability: { type: Number, required: true },
    status: { type: Boolean, default : true },
    Price: { type: Number, required: true },
    Quantity: { type: String, required: true },
    Productimg : {type : String , required : true},
    ProductDetail : {type : String, required : true}

})

const ProductModel = mongoose.model('products', productSchema)

module.exports = ProductModel;
