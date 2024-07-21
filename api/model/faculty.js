const mongoose=require('mongoose')

const Facultyschema=new mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    name:String,
    subject:String,
    email:String,
    age:Number,
    village:String
})
module.exports=mongoose.model('Faculty',Facultyschema)