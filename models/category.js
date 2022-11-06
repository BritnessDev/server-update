const mongoose = require("mongoose")



const categorySchema = mongoose.Schema({
    categoryName : {type : String , required : true },
    Catimg : {type:String , required:true}
})

const categoryModel = mongoose.model('categories' , categorySchema)









module.exports =  categoryModel ;