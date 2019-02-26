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
router.put('/:id', (req, res)=>{
    cloudinary.v2.uploader.rename(oldName, newName,
        (error, result) => {
            if (error) res.send(error);
            House.findOneAndUpdate({ image_id: oldName },
                Object.assign({}, req.body, { image: result.url }),
                function (err) {
                    if (err) res.send(err);

                    res.redirect('/');
                })
        })
});

/** GET /houses */

/** DELETE /houses/:id */
router.post('/delete', (req, res)=>{
    var imageId = req.body.image_id;
    cloudinary.v2.uploader.destroy(imageId, function (error, result) {
        Model.findOneAndRemove({ image_id: imageId }, function (err) {
            if (err) res.send(err);

            res.redirect('/');
        });
    });
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
                res.redirect('/houses');                
            }, (e) => {
                res.status(400).send(e);
            });
         });
});


module.exports = router;
