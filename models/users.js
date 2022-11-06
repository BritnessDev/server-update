const mongoose = require("mongoose")


const Users = mongoose.Schema({
    username: { type: String,  required: true, index: { unique: true } },
    email:    { type: String,  required: true, index: { unique: true } },
    password: { type: String,  required: true },
    status:   { type: Boolean, required: true, default: true },
    role:     { type: String,  required: true, default: "public", enum: ["public", "admin"] },
    date:     { type: Date,    required: true,default: Date.now }
})

const UserModel = mongoose.model("users", Users);

module.exports = UserModel;