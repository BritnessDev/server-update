const categoryModel = require("../models/category")

module.exports = {
    CheckCategory: async function (req, res, next) {
        var categoryName = req.body.Productcat
        var CheckCat = categoryModel.find({ categoryName: categoryName })
        CheckCat.exec((err, data) => {
            console.log("Get Data", data);
            if (err) throw err;
            if (data.length != 0) {
                // res.render('AddProduct', { title: 'Express', msg: 'Email Already Exist' });
                next()
            }
            else {
                return res.render('AddProduct', { title: 'Express', msg: 'Invlid Category' });
            }

        })
    }
}