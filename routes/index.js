const express = require('express');
const router = express.Router();
const path = require("path")
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const multer = require("multer")
const url = require('url');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const current_url = new URL('http://localhost:3000/products');
const search_params = current_url.searchParams;````


// Models
const categoryModel = require("../models/category")
const ProductModel = require("../models/productmodel")
const UserModel = require("../models/users")
const cartModel = require("../models/cart")


// Middlewares
const { CheckCategory } = require("../middlewares/CheckCategory")
const { CheckMail } = require("../middlewares/CheckMail")
const { CheckUser } = require("../middlewares/CheckUser");
const { text } = require('express');

router.use('/products', express.static('public'))



/************************************************/
/*                    Multer                    */
/************************************************/
const Storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))

  }
})

var upload = multer({
  storage: Storage
}).single('file');





/************************************************/
/*                    Home                      */
/************************************************/
router.get('/', async function (req, res) {
  var Get = await ProductModel.find({}).sort({ _id: -1 }).limit(8)
  var Get1 = await ProductModel.find({}).limit('4').sort({ _id: -1 })
  var Get2 = await categoryModel.find({}).limit('3').sort({ _id: -1 })
  return res.render('workspace', { title: 'Express', msg: "", ll9: "", products: Get, featuredproducts: Get1, featuredcategory: Get2 });
});



/************************************************/
/*                  Account                     */
/************************************************/
router.get('/account', function (req, res) {
  return res.render('account', { title: 'Express', msg: "", ll9: "" });
});



/************************************************/
/*                  Products                    */
/************************************************/
router.get('/products', async function (req, res) {

  let skipppp = 8
  let Limittt = 8
  const filter = req.query.filter == "default" || typeof req.query.filter == "undefined" ? { "_id": -1 } : { "Price": -1 }
  const page = typeof req.query.page == "undefined" ? 0 : parseInt(req.query.page) - 1

  myflter = {}
  if(typeof req.query.category != "undefined") {
    myflter.productCategory = (req.query.category).trim()
  }

  const cat = await categoryModel.find({}, { categoryName: 1 })

  var Get = await ProductModel.find( myflter )
    .limit(Limittt)
    .skip(parseInt(page) * skipppp)
    .sort(filter)

    console.log("req.query.", req.query.category)
    console.log(Get);

  await ProductModel.countDocuments(myflter)
    .then(data => {
      return res.render('products', { title: 'Express', products: Get, categories: cat, total: data, itemPerPage: skipppp });
    })

});



/************************************************/
/*              Product Details                 */
/************************************************/
router.get('/products/:productid?', async function (req, res) {
  try {
    const id = req.params.productid;
    const cate = req.body.productCategory;
    var Get = await ProductModel.find({ _id: id, related: cate })
    var Get1 = await ProductModel.find({ related: cate }).limit('4')
    return res.render("Products-Details", { products: Get, related: Get1 })

  } catch (error) {
    console.log(error);
    return res.send("Server Error")
  }
})



/************************************************/
/*                 Categories                   */
/************************************************/
router.get('/product/:category', async function (req, res) {
  const category = req.params.category;
  var Get = await ProductModel.find({ productCategory: category })
  console.log("Mens", Get);
  return res.render("product", { products: Get })
  // return res.json({ products: Get })

})



/************************************************/
/*                    Auth                      */
/************************************************/
router.post('/account', async (req, res) => {
  console.log("ok");

  if (req.body.myaction == "register") {
    var username = req.body.username
    var email = req.body.email
    var password = req.body.password
    // var confirm_password = req.body.con_password

    // if (password != confirm_password) {
    //   return res.render("account", { msg: "Password not match." })
    // }

    const encryptPassword = await bcrypt.hash(password, 10)

    var UserDetails = new UserModel({
      username: username,
      email: email,
      password: encryptPassword
    })
    UserDetails.save()
      .then(data => {
        console.log(data);
        return res.redirect(200, '/account')
      })
      .catch(err => {
        console.log(err);
        return res.render('account', { msg: "Error in registration" })
      })

  }
  else {
    var username = req.body.user
    var password = req.body.pass

    var CheckEmail = UserModel.findOne({ username: username })
      .then(data => {
        // console.log();
        console.log("data", data);

        if (data) {
          var GetUserName = data.username
          var GetUserEmail = data.email
          var GetUserId = data._id
          var getPassword = data.password

          bcrypt.compare(password, getPassword)
            .then(async isCorrect => {
              console.log("isCorrect" + isCorrect);

              if (isCorrect) {
                const payload = {
                  id: GetUserId,
                  email: GetUserEmail,
                  username: GetUserName,
                  role: data.role,
                }

                jwt.sign(
                  payload,
                  process.env.JWT_SECRET,
                  {
                    expiresIn: 86400
                  },
                  (err, token) => {
                    if (err) return res.render('account', { title: 'Express', msg: 'Invalid email or password', ll9: "" });
                    // return res.json({
                    //   msg: "Login successfully",
                    //   token: `Bearer ${token}`
                    // })

                    console.log("token =>", `Bearer ${token}`);

                    return res.render('account', { title: 'Express', msg: '', ll9: `Bearer ${token}` });

                    // return res.redirect('/product');

                  }
                )

              } else {
                return res.render('account', { title: 'Express', msg: 'Invalid email or password', ll9: "" });

              }
              // return res.redirect('dashboard');
              // return res.render('login', { title: 'Express', msg: 'Invalid Username or password' });

            })

        } else {
          return res.render('account', { title: 'Express', msg: 'Invalid email or password', ll9: "" });

        }



      })
      .catch(err => {
        console.log(err);
        return res.render('account', { title: 'Express', msg: 'Invalid email or password', ll9: "" });
      })

  }


});



/************************************************/
/*                                              */
/************************************************/
router.post('/products/:productid?', async function (req, res) {
  const id = req.params.productid;
  var Get = await ProductModel.find({ _id: id })

  return res.render("Products-Details", { products: Get })
})



/************************************************/
/*                    Cart                      */
/************************************************/
router.get('/cart', async (req, res) => {
  try {

    let b64DecodeUnicode = str =>
      decodeURIComponent(
        Array.prototype.map.call(atob(str), c =>
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''))

    let parseJwt = token =>
      JSON.parse(
        b64DecodeUnicode(
          token.split('.')[1].replace('-', '+').replace('_', '/')
        )
      )

    if (typeof req.query.as33 == "undefined" || req.query.as33 == null) {
      return res.redirect(200, "/account")
    }

    userDATA = await parseJwt(req.query.as33)

    console.log(userDATA);

    await cartModel.find({
      UserId: ObjectId(userDATA.id)
    })
    .populate({ path: "productId", select: ["Productimg"]})
      .then(data => {
        console.log("data");
        console.log("data");
        console.log("data");
        console.log("data");
        console.log("data");
        console.log(data);
        if (data.length > 0) {

          return res.render('cart', { title: 'Express', msg: "", ll9: "", data });
          
        } else {
          return res.render('cart', { title: 'Express', msg: "", ll9: "", data });
        }
      })

  } catch (error) {
    console.log(error);
    return res.json({ error: 'system error' })
  }
})



/************************************************/
/*                Add To Cart                   */
/************************************************/
router.post('/add-to-cart/:myid', async function (req, res) {
  console.log("Body", req.body);
  console.log("params", req.params);
  const myid = req.body.id;

  const find = await cartModel.find({ productId: (req.body.id), UserId: (req.params.myid) })
    .then(async data => {
      console.log("data");
      console.log(data);
      if (data.length == 0) {

        new cartModel({
          UserId: (req.params.myid),
          productId: (req.body.id),
          productName: req.body.productName,
          Price: req.body.Price[0],
          Quantity: req.body.quantity
        })
          .save()
          .then(data => {
            console.log(data);
            return res.redirect(`/products/${myid}`)
          })
          .catch(err => {
            console.log(err);
          })

      } else {

        await cartModel.updateOne({
          UserId: ObjectId(req.params.myid)
        }, {
          $inc: { Quantity: parseInt(req.body.quantity) }
        })
          .exec()
          .then(async (data) => {
            console.log();
            return res.redirect(`/products/${myid}`)
          })
      }
    })
    .catch(err => {
      console.log(err);
    })




  // res.redirect('/cart')

})



/************************************************/
/*             Remove From Cart                 */
/************************************************/
router.get('/update-item/:id/:act', async (req, res) => {
  try {
    let action = 1
    if(req.params.act == "sub") {
      action = -1
    } else {
      action = 1
    }
    await cartModel.findOneAndUpdate({
      _id: ObjectId(req.params.id)
    }, {
      $inc: { Quantity: action }
    })
      .exec()
      .then(async (data) => {
        console.log(data);
        return res.redirect(`/cart?as33=${req.query.as33}`)
      })

  } catch (error) {
    console.log(error);
    return res.redirect(`/cart?as33=${req.query.as33}`)
  }
})



/************************************************/
/*             Remove From Cart                 */
/************************************************/
router.get('/remove-item/:id', async (req, res) => {
  try {
    await cartModel.findOneAndRemove({
      _id: ObjectId(req.params.id)
    })
      .exec()
      .then(async (data) => {
        console.log(data);
        return res.redirect(`/cart?as33=${req.query.as33}`)
      })

  } catch (error) {
    console.log(error);
    return res.redirect(`/cart?as33=${req.query.as33}`)
  }
})



/************************************************/
/*                  Dashboard                   */
/************************************************/
router.get('/dashboard', async function (req, res) {
  const productsCount = await ProductModel.countDocuments({})
  const categoriesCount = await categoryModel.countDocuments({})

  var Get = await ProductModel.find({})
    .limit('5')
    .sort({ _id: -1 })
    .populate({ path: "productCategory" })


  return res.render('admin/dashboard', { title: 'Express', msg: "", ll9: "", products: Get, productsCount, categoriesCount });
});



/************************************************/
/*                 Add Product                  */
/************************************************/
router.get('/add-product', async function (req, res) {
  const categories = await categoryModel.find({})
  console.log("cat", categories);
  return res.render('admin/AddProduct', { title: 'Express', msg: "", categories: categories });
});

router.post('/add-product', upload, CheckCategory, function (req, res, next) {
  var img = req.file.filename
  const AddProduct = new ProductModel({
    productName: req.body.Productname,
    productCategory: req.body.Productcat,
    Price: req.body.Price,
    Quantity: req.body.Quantity,
    Productimg: img,
    ProductDetail: req.body.textarea
  })
  AddProduct.save()
    .then(data => {
      console.log(data);
      return res.redirect('/add-product')
    })
    .catch(err => {
      console.log(err);
    })
});


/************************************************/
/*                Add Category                  */
/************************************************/
router.get('/add-category', async function (req, res) {
  var featuredcategory = await categoryModel.find({})
    .sort({ _id: -1 })
  console.log("cat", featuredcategory);
  return res.render('admin/add-category', { title: 'Express', });
});

router.post('/add-category', upload, function (req, res) {
  console.log(req.body);
  var img = req.file.filename
  const Category = new categoryModel({
    categoryName: req.body.Category,
    Catimg: img

  })
  Category.save()
    .then(data => {
      return res.redirect('/add-category')
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    })
});



/************************************************/
/*                Product Table                 */
/************************************************/
router.get('/product-table', async function (req, res) {
  var Get = await ProductModel.find({}).sort({ _id: -1 })
  console.log(Get);
  return res.render('admin/Product-table', { title: 'Express', productsintable: Get });
});



/************************************************/
/*               Category Table                 */
/************************************************/
router.get('/category-table', async function (req, res) {
  var Get = await categoryModel.find({}).sort({ _id: -1 })
  console.log(Get);
  return res.render('admin/category-table', { title: 'Express', products: Get });

});




module.exports = router;