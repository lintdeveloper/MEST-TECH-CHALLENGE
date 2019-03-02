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


    res.render('checkout', {total: totalPrice})
});
module.exports = router;
