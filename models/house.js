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
    }
});

const House = mongoose.model('House', HouseSchema);
module.exports = {House};
