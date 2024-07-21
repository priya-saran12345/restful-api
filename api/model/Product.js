const mongoose=require('mongoose')
const productSchema=new mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    description:String,
    imagepath:String,
    mrp:Number
})
module.exports=mongoose.model('Product',productSchema)