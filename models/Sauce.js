const mongoose = require('mongoose');
const validator = require('../middleware/sauce-validator');

const sauceSchema = mongoose.Schema ({
    userId: { type: String, required: true },
    name : { type: String, required: true, validate: validator.nameValidator },
    manufacturer : { type: String, required: true, validate: validator.manufacturerValidator },
    description : { type: String, required: true, validate: validator.descriptionValidator },
    mainPepper : { type: String, required: true, validate: validator.mainPepperValidator },
    imageUrl : { type: String, required: true },
    heat : { type: Number, required: false },
    likes : { type: Number, required: false, default : 0 },
    dislikes : { type: Number, required: false, default : 0 },
    usersLiked : { type: [String], required: false },
    usersDisliked : { type: [String], required: false },
});

module.exports = mongoose.model('Sauce', sauceSchema);