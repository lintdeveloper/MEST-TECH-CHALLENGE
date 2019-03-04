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
    }
}