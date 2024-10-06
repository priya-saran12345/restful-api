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
router.get('/:id',(req,res,next)=>{
  const _id = req.params.id;
  Product.findById(_id)
  .select('_id title productCode description price ctgry photo')
  .then(result=>{
    // console.log(result)
    res.status(200).json({
      product:result
    })
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      error:err
    })
  })
})


// Create a new product
router.post('/',(req,res,next)=>{
  console.log(req);
  console.log(req.files);
  const file = req.files.photo;
  cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
    console.log(result);
    myproduct = new Product({
      _id:new mongoose.Types.ObjectId,
      title:req.body.title,
      ctgry:req.body.ctgry,
      price:req.body.price,
      description:req.body.description,
      productCode:req.body.productCode,
      photo:result.url
    });
    myproduct.save()
    .then(result=>{
      console.log(result);
      res.status(200).json({
        new_product:result
      })
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({
        error:err
      })
    })
  });

})

// Update a product
router.put('/:id',(req,res,next)=>{
  console.log(req.params.id);
  const file = req.files.photo;
  console.log(file);
  cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
    console.log(result);
    Product.findOneAndUpdate({_id:req.params.id},{
      $set:{
        title:req.body.title,
        ctgry:req.body.ctgry,
        price:req.body.price,
        description:req.body.description,
        productCode:req.body.productCode,
        photo:result.url
      }
    })
    .then(result=>{
      res.status(200).json({
        updated_product:result
      })
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({
        error:err
      })
    })
  })

})

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
