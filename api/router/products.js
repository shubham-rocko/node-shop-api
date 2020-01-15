const express = require("express");
const mongoose = require('mongoose');
const multer = require('multer');

const Product = require('../models/product');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
        cb(null, true);
    } else {
        cb(new Error('File type is not supported'), false); //reject file and don't save it
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const router = express.Router();

router.get('/', (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .exec().then(docs => {
        const response = {
            count: docs.length,
            products: docs.map((doc) => ({
                name: doc.name,
                price: doc.price,
                _id: doc._id,
                productImage: doc.productImage,
                request: {
                    method: "GET",
                    url: "http://localhost:3000/products"+doc._id
                }
            }))
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
});

router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then((result) => {
        console.log(result);
        res.status(201).json({
            message: "Created product successfully",
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    method: "POST",
                    url: "http://localhost:3000/products"+result._id
                }
            }
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json({error: err})
    })
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then((product) => {
        console.log(product);
        if(product){
            res.status(200).json({
                product: product,
                request : {
                    method: "GET",
                    url: "http://localhost:3000/products"+product._id
                }
            });
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
        res.status(200).json({
            product : result,
            request: {
                method: "PATCH",
                url: "http://localhost:3000/products"+result._id
            }
        });
    })
    .catch((err) => {
        res.status(500).json({error: err});
    });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({_id: id}).exec()
    .then((result) => {
        res.status(200).json({
            message: "Product has been delete",
            product: result
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

module.exports = router;