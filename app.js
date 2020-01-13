const express = require("express");

const app = express();

const productsRoutes = require('./api/router/products');
const ordersRoutes = require('./api/router/orders');

app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

module.exports = app;