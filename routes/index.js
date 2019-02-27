var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
const { House } = require('../models/house');

/* GET home page. */
router.get('/', function(req, res) {
 res.render('index')
});

router.get('/add-to-cart/:id', function (req, res) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart.items : {});

    House.findById(productId, function (err, house) {
        cart.add(house, house.id);
        req.session.cart = cart;
        // console.log(req.session.cart);
        
        res.redirect('/');
    });
});

module.exports = router;
