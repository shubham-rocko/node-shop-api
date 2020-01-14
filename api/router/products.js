const express = require("express");
const mongoose = require('mongoose');
const Product = require('../models/product');

const router = express.Router();

router.get('/', (req, res, next) => {
    Product.find().exec().then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then((result) => {
        console.log(result);
        res.status(201).json({
            message: "Handling POST request to products",
            createdProduct: result
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json({error: err})
    })
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).exec()
    .then((product) => {
        console.log(product);
        if(product){
            res.status(200).json(product)
        } else{
            res.status(404).json({message: "Specific product is out of stock. We will add it soon."})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(let ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, { $set: updateOps }).exec()
    .then((result) => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch((err) => {
        res.status(500).json({error: err});
    });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({_id: id}).exec()
    .then((result) => {
        res.status(200).json(result);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

module.exports = router;