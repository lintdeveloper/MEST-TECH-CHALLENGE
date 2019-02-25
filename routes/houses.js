const express = require('express'),
      router = express.Router(),
      multipart = require('connect-multiparty'),
      multipartMiddleware = multipart(),
      cloudinary = require('cloudinary');

/* Models */
const { House } = require('../models/house');

/* GET /houses */
router.get('/', function (req, res) {
    res.render('houses/index')
});

/** GET /houses/new  */
router.get("/new", (req, res)=>{
    res.render('houses/new');
});

/** POST /houses */
router.post('/', multipartMiddleware, (req, res)=>{
    let picturePath = req.files.picture.path;
    cloudinary.v2.uploader.upload(picturePath, { width: 300, height: 300, crop: "limit", tags: req.body.tags, moderation: "manual", timeout: 60000 }, (err, result)=>{
            if (err) {
                console.log(err);
            }

            let house = new House({
                item_name: req.body.item_name,
                description: req.body.description,
                price: req.body.price,
                picture: result.url
            });

            house.save().then((doc) => {
                console.log(doc);
                res.redirect('/houses')                
            }, (e) => {
                res.status(400).send(e);
            });
         });
});


module.exports = router;
