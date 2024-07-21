const express=require('express')
const router=express.Router()
const Student=require('../model/student')
const mongoose=require('mongoose')

router.get('/',(req,res,next)=>{
    Student.find().then(result=>{
        console.log(result)
        res.status(200).json({
            Studentdata:result
 
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})




//post request for saving the data in the database.
router.post('/',(req,res,next)=>{
// console.log(req.body);
const student=new Student({
_id:new mongoose.Types.ObjectId,
name:req.body.name,
gender:req.body.gender,
email:req.body.email,
phone:req.body.phone
})

//for saving the data in the database
student.save().then(result=>{
    console.log(result)
    res.status(200).json({
    newStudent:result
    })
}).catch(err=>{
    console.log(err)
    res.status(500).json({
        error:err
    })
})
})


module.exports=router