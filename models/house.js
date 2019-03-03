const mongoose =require('mongoose'),
      Schema = mongoose.Schema;

const HouseSchema = new Schema({
    item_name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    description: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    price: {
        type: Number,
         required: true,
         default: null
    },
    picture: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }, 
    picture_id: {
        type: String,
        trim: true,
        minlength: 1,
        required: true
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        usermail: String
    }
});

const House = mongoose.model('House', HouseSchema);
module.exports = {House};
