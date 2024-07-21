const mongoose=require('mongoose')
const signupSchema=new mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    name:String,
    email:String,
    phone:Number,
    password:String,
    usertype:String
})
module.exports=mongoose.model('User',signupSchema)