const Product = require('../model/Product')
const mongoose = require('mongoose')
const express = require('express')
const auth = require('../middleware/auth')
//import cloudinary
const cloudinary = require('cloudinary').v2
const router = express.Router()

// code for clodinary configuration
cloudinary.config({
    cloud_name: 'djjmlhgte',
    api_key: '618184577117257',
    api_secret: 'CLDJ1EsjCAtEcfeA2goJK9JClqo'
})

router.get('/', (req, res, next) => {
    Product.find().then(result => {
        res.status(200).json({
            result: result
        })
    })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})
//get data from particular id 

router.get('/:id', (req, res, next) => {
    Product.findById(req.params.id).then(result => {
        res.status(200).json({
            result: result
        })
    })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

// post request


router.post('/', (req, res, next) => {
    console.log(req.body)
    const file = req.files.photo
    cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
        console.log(result)
        const product = new Product({
            _id: new mongoose.Types.ObjectId,
            description: req.body.description,
            mrp: req.body.mrp,
            imagepath: result.url
        })
        product.save().then(result => {
            res.status(200).json({
                savedProduct: result
            })
        })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })
    })

})

// for the  update to the product

router.put('/:id',auth, (req, res, next) => {
    Product.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            description: req.body.description,
            mrp: req.body.mrp,
            // imagepath:req.files.photo

        }
    }).then(result => {
        res.status(200).json({
            msg: "updated successfully",
            result: result
        })
    })
        .catch(err => {
            res.status(500).json({
                error: err.message
            })
        })
})


// // api  for delete the product
router.delete('/',auth, (req, res, next) => {

    const imageurl = req.query.imageurl
    console.log(imageurl)
    const urlarray = imageurl.split('/')
    const imagename = urlarray[urlarray.length - 1]
    const image = imagename.split('.')[0]
    console.log(image)
    Product.findByIdAndDelete({_id:req.query.id})
        .then(result => {
            cloudinary.uploader.destroy(image, (err, res) => {
                console.log(err, res)
            })
            res.status(200).json({
                msg: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router
