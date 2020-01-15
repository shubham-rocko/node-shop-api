const mongoose = require('mongoose');

/**
 * creating schema 
 */
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    price: {type: Number, required: true}
});

//Export model which have different method to manipilate DB
module.exports = mongoose.model("Product", productSchema);