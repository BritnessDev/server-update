const UserModel = require("../models/users");



module.exports = {
    CheckUser: async function (req, res, next) {
        var username = req.body.username
        var checkUser = await UserModel.find({ username: username })
        if (checkUser.length > 0) {
            return res.render('account', { msg: "User Already exist" })
        }
        else {
            // return res.render('signup', { msg: "" })
            next()

        }
    }
}