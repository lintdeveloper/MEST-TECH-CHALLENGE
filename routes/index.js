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
    if(!req.session.cart){
        return res.render('cart', { houses: null });
    }
    var cart = new Cart(req.session.cart.items);
    res.render('cart', { houses: cart.generateArray(), totalPrice: cart.totalPrice });
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

// Checkout 
router.get('/checkout', (req, res)=>{
    if(!req.session.cart){
        return res.redirect('cart')
    };
    var cart = new Cart(req.session.cart.items);

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    let price = numberWithCommas(cart.totalPrice);
    let totalPrice = price.concat('.00');
    let errMsg = req.flash('error')[0];
    res.render('checkout', {total: totalPrice, errMsg, noError: !errMsg})
});

router.post('/checkout', (req, res, next)=>{

    if (!req.session.cart) {
        return res.redirect('/cart');
    }

    let cart = new Cart(req.session.cart.items);

    var stripe = require("stripe")("sk_test_lwVK1we4zIKVJMSBqmXMO4b1");

    console.log(cart.totalPrice);
    
    stripe.charges.create({
        amount: cart.totalPrice,
        currency: "ngn",
        source: "tok_visa", 
        description: "Testing"
    }, function(err, charge) {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('/checkout');
            }
            req.flash('success', 'Successfully bought product!');
            req.session.destroy();
            res.redirect('/cart');
    });
})
module.exports = router;
