/* Models */
const { House } = require('../models/house');

module.exports = {
    index: (req, res) => {
        House.find().then((houses) => {
            res.render("houses/index", { houses: houses, user: req.user });
        });
    },
    new : (req, res)=> {
        let user = req.user;
        res.render('houses/new', { user: user }
    )},
    id: (req, res) => {
        House.findById(req.params.id).then((house) => {
            res.json(house)
        })
    },
    update: (req, res)=> {
    let id = req.params.id;
    console.log(req.user);

    House.find({ _id: id }, (err, houses) => {
        res.render('houses/update', { house: houses[0], user: req.user })
    })},
    postUpdate: (req, res) => {
        let oldName = req.body.old_id,
            newName = req.body.picture_id;

        cloudinary.v2.uploader.rename(oldName, newName,
            (error, result) => {
                if (error) res.send(error);
                House.findOneAndUpdate({ picture_id: oldName },
                    Object.assign({}, req.body, { picture: result.url }),
                    function (err) {
                        if (err) res.send(err);
                        res.redirect('/dashboard');
                    })
            })
    },
    delete: (req, res) => {
        let pictureId = req.body.picture_id;
        cloudinary.v2.uploader.destroy(pictureId, (error, result) => {
            House.findOneAndDelete({ picture_id: pictureId }, (err) => {
                if (err) res.send(err);
                res.redirect('/dashboard');
            });
        });
    },
    postHouse: (req, res) => {
        let picturePath = req.files.picture.path;
        cloudinary.v2.uploader.upload(picturePath, { width: 300, height: 300, crop: "limit", tags: req.body.tags, moderation: "manual", timeout: 60000 }, (err, result) => {
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
    }
}