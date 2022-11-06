const UserModel = require("../models/users");



module.exports = {
    CheckMail: async function (req, res, next) {
        var email = req.body.email
        var checkMail = await UserModel.find({ email: email })
        console.log(checkMail);
        if (checkMail.length > 0) {
            return res.render('account', { msg: "Email Already exist" })
        }
        else {
            next()

        }
    }
}