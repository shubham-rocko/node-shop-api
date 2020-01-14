const mongoose = require('mongoose');

/**
 * creating schema 
 */
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number
});

//Export model which have different method to manipilate DB
module.exports = mongoose.model("Product", productSchema);