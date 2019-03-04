const express = require('express'),
      router = express.Router(),
      multipart = require('connect-multiparty'),
      multipartMiddleware = multipart(),
      cloudinary = require('cloudinary'),
      {ensureAuthenticated} = require('../config/auth');
      controller = require('../controllers/house.controllers')

/* Models */
const { House } = require('../models/house');

/* GET /houses */
router.get('/', controller.index);

/** GET /houses/new  */
router.get("/new", ensureAuthenticated, controller.new);

/** GET /houses/:id */
router.get('/:id', controller.id);

/** GET /houses/update */
router.get('/:id/update', ensureAuthenticated, controller.update);

/** Updates the route /houses/:id */
router.post('/update', ensureAuthenticated, controller.postUpdate);

/** GET /houses */

/** DELETE /houses/:id */
router.post('/delete', ensureAuthenticated, controller.delete);


/** POST /houses */
router.post('/', multipartMiddleware, ensureAuthenticated, (req, res)=>{
    let picturePath = req.files.picture.path;
    cloudinary.v2.uploader.upload(picturePath, { width: 300, height: 300, crop: "limit", tags: req.body.tags, moderation: "manual", timeout: 60000 }, (err, result)=>{
            if (err) {
                console.log(err);
            }

            let house = new House({
                item_name: req.body.item_name,
                description: req.body.description,
                author: {
                    id: req.user._id,
                    usermail: req.user.email
                },
                price: req.body.price,
                picture: result.url,
                picture_id: result.public_id
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
