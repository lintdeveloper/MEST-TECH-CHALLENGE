var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
const { House } = require('../models/house'),
{ ensureAuthenticated } = require('../config/auth');

/* GET home page. */
router.get('/', (req, res) => {
    let cart = req.session.cart;
    let user = req.user;
    res.render('index', {cart, user})
});

// GET /cart
router.get('/cart', (req, res)=>{
    console.log(req.session.cart);
    res.render('cart');
})

// Adds Item to Shopping Cart
router.get('/add-to-cart/:id', function (req, res) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart.items : {});

    House.findById(productId, function (err, house) {
        cart.add(house, house.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/houses');
    });
});

module.exports = router;
