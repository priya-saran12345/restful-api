const express=require('express')
const faculty=express.Router()//creating routes 
const  mongoose=require('mongoose')
const Faculty=require('../model/faculty')


faculty.get('/',(req,res,next)=>{
    Faculty.find().then(result=>{
        res.status(200).json({
all_faculty_data:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})

// get request for the particular id in the api
faculty.get('/:id',(req,res,next)=>{
    console.log(req.params.id)
    Faculty.findById(req.params.id).then(result=>{
        res.status(200).json({
            singlefaculty:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:error
        })
    })
})


faculty.post('/',(req,res,next)=>{
const faculty=new Faculty({
    _id:new mongoose.Types.ObjectId,
    name:req.body.name,
    subject:req.body.subject,
    email:req.body.email,
    age:req.body.age,
    village:req.body.village

})
faculty.save().then(result=>{
    res.status(200).json({
        new_faculty_data:result
    })
}).catch(err=>{
    res.status(500).json({
        eror:err
    })
})







})




module.exports=faculty