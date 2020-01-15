const express = require("express");
const app = express();
const morgan = require ('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productsRoutes = require('./api/router/products');
const ordersRoutes = require('./api/router/orders');

mongoose.promise = global.promise;

mongoose.connect('mongodb+srv://node-shop-api:Shubham%406@cluster0-yr5nx.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); //mongoAtlas connection

app.use(morgan('dev')); //log to terminal whatever happen
app.use('/uploads', express.static('uploads')); //make the folder public which is for everyone (externally used)
app.use(bodyParser.urlencoded({extended: false})); //parse json body of the request
app.use(bodyParser.json());

/**
 * Enable CORS (Cross Origin Resourse Sharing)
 */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Request-With, Content-Type, Accepted, Authorization'
        );
    if(req.method === "OPTIONS") {
        req.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;