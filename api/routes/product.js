const Product = require('../model/Product');
const mongoose = require('mongoose');
const express = require('express');
const auth = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const router = express.Router();

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'djjmlhgte',
    api_key: '618184577117257',
    api_secret: 'CLDJ1EsjCAtEcfeA2goJK9JClqo'
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const result = await Product.find();
        res.status(200).json({ result });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get product by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const result = await Product.findById(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ result });
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ error: err.message });
    }
});

// Create a new product
router.post('/', auth, async (req, res) => {
    try {
        if (!req.files || !req.files.photo) {
            return res.status(400).json({ error: 'Image file is required' });
        }

        const file = req.files.photo;
        const cloudinaryResult = await cloudinary.uploader.upload(file.tempFilePath);
        
        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            description: req.body.description,
            mrp: req.body.mrp,
            imagepath: cloudinaryResult.url
        });

        const savedProduct = await product.save();
        res.status(201).json({ savedProduct });
    } catch (err) {
        console.error('Error saving product:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update a product
router.put('/:id', auth, async (req, res) => {
    try {
        const result = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: { description: req.body.description, mrp: req.body.mrp } },
            { new: true, runValidators: true } // Return the updated document and validate
        );

        if (!result) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ msg: "Updated successfully", result });
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete a product
router.delete('/', auth, async (req, res) => {
    try {
        const imageurl = req.query.imageurl;
        const urlarray = imageurl.split('/');
        const imagename = urlarray[urlarray.length - 1];
        const image = imagename.split('.')[0];

        const deletedProduct = await Product.findByIdAndDelete(req.query.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await cloudinary.uploader.destroy(image);
        res.status(200).json({ msg: 'Product deleted successfully', result: deletedProduct });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
