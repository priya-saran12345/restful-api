const Signup = require('../model/user')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/signup', (req, res, next) => {

    // for the password encryption
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                msg: "not encrypted"
            })

        }
        else {

            const signup = new Signup({
                _id: new mongoose.Types.ObjectId,
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                usertype: req.body.usertype,
                password: hash
            })
            signup.save().then(result => {
                res.status(200).json({
                    signedup_user: result
                })
            })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
        }
    })

})



// for the login of the user
router.post('/login', (req, res, next) => {
    Signup.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    msg: "user not found"
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (!result) {
                    return res.status(401).json({
                        msg: "invalid user"

                    })
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        usertype: user[0].usertype,
                        password: user[0].password,
                        phone: user[0].phone,
                        name:user[0].name
                    },
                        'this iss the dummy text',
                        {
                            expiresIn: '24h'
                        }
                    )
                    res.status(200).json({
                        msg: "token created",
                        email: user[0].email,
                        usertype: user[0].usertype,
                        phone: user[0].phone,
                        token: token,
                        name:user[0].name
                        
                    })



                }
            })
        })
        .catch(err=>{
            res.status(500).json({
            msg:'user not found'
            })
        })
})

module.exports = router


