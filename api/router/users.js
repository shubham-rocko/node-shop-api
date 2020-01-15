const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

route.post('/signup', (req, res, next) => {
    User.find({email: req.body.email}).exec()
    .then((user) => {
        if(user.length > 0){
            return res.status(409).json({
                message: 'User Exist'
            });
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    res.status(500).json({error: err});
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                    .then(user => {
                        console.log(user);
                        res.status(201).json({
                            message: "User created"
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({error: err});
                    });
                }
            });
        }
    });
});

module.exports = route