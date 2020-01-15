const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order.find()
    .select('productId quantity _id')
    .populate('productId name')
    .exec()
    .then((result) => {
        res.status(200).json({
            count: result.length,
            orders: result.map(doc => ({
                _id: doc._id,
                productId: doc.productId,
                quantity: doc.quantity,
                request: {
                    method: "GET",
                    url: "http://localhost:3000/orders/"+doc._id
                }
            }))
        });
    }).catch((err) => {
        res.status(500).json({error: err});
    });
});

router.post('/', (req, res, next) => {
    const productId = req.body.productId
    Product.findById(productId)
    .then((product) => {
        if(!product){
            return res.status(404).json({message: "Product is out of stock"});
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            productId: productId,
            quantity: req.body.quantity
        });
    
        return order.save()
        .then((result) => {
            res.status(201).json({
                message: "Orders was created",
                createdOrder: result,
                request: {
                    method: "GET",
                    url: "http://localhost:3000/orders" + result._id
                }
            });
        })
        .catch((err) => {
            res.status(500).json({error: err});
        });
    });
});

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('productId name')
    .exec()
    .then((order) => {
        if(order){
            res.status(200).json({
                message: "Order details",
                orderId: order,
                request: {
                    method: "GET",
                    url: "http://localhost:3000/orders"
                }
            });
        }else{
            res.status(404).json({message: "order doesn't present"});
        }
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
});

router.delete('/:orderId', (req, res, next) => {
    Order.deleteOne({_id: req.params.orderId}).exec()
    .then((result) => {
        res.status(200).json({
            message: "Order deleted"
        })
    })
    .catch((err) => {res.status(500).json({error: err})});
    res.status(200).json({
        message: 'Orders Deleted'
    });
});

module.exports = router;