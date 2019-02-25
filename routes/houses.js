const express = require('express'),
      router = express.Router(),
      multipart = require('connect-multiparty'),
      multipartMiddleware = multipart(),
      cloudinary = require('cloudinary');

/* Models */
const { House } = require('../models/house');

/* GET /houses */
router.get('/', function (req, res) {
    House.find().then((houses)=>{
        res.json(houses)
    });
});

/** GET /houses/new  */
router.get("/new", (req, res)=>{
    res.render('houses/new');
});

/** GET /houses/:id */
router.get('/:id', (req, res)=>{
    House.findById(req.params.id).then((house)=>{
        res.json(house)
    })
});

/** GET /houses/update */
router.get('/:id/update', (req, res)=>{
    House.findById(req.params.id).then((house)=>{
        console.log(house);
        res.render('houses/update',{house: house})
    });
});

/** PUT /houses/:id */
// router.put('/:id', (req, res)=>{
//     House.findByIdAndUpdate(req.params.id, req.body.house).then((house)=>{
//         res.redirect('/houses/'+ req.params.id);
//     });
// });

/** DELETE /houses/:id */


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
                res.redirect('/houses');                
            }, (e) => {
                res.status(400).send(e);
            });
         });
});


module.exports = router;
