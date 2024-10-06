const cors = require('cors');
const express=require('express')
const app=express()

const studentroute=require('./api/routes/student')
const facultyroute=require('./api/routes/faculty')
const productroute=require('./api/routes/product')
const signuproute=require('./api/routes/user')
const fileupload=require('express-fileupload')


app.use(cors()); // Apply CORS middleware
const mongoose=require('mongoose')
const bodyparser=require('body-parser')


// for connection to the database using mongoose
mongoose.connect('mongodb+srv://ps:priya123@cluster0.nxbgw6r.mongodb.net/')
//check if error in connection
mongoose.connection.on('error',err=>{
    console.log('connection failed!')
})
//check if connected successfully
mongoose.connection.on('connected',connected=>{
    console.log('connected with the database successfully')
}

)


// code for the cloudinary file uploaded
app.use(fileupload({
    useTempFiles:true
}))


// use the body parser 
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())



// calling router for the router    
app.use('/student',studentroute)
app.use('/faculty',facultyroute)
app.use('/product',productroute)
app.use('/',signuproute)


//  for the bad uurl
app.use((req,res,next)=>{ 
    res.status(404).json({
        msg:"bad request"
    })
})


// export the app for using in the another file
module.exports=app
