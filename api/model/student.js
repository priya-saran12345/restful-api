const mongoose =require('mongoose')
//create the schmena 
 
const studentschema= new mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    name:String,
    email:String,
    phone:Number,
    gender:String
})

module.exports=mongoose.model('Student',studentschema)