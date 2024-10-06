const express = require('express');
const app = express();

const studentroute = require('./api/routes/student');
const facultyroute = require('./api/routes/faculty');
const productroute = require('./api/routes/product');
const signuproute = require('./api/routes/user');
const fileupload = require('express-fileupload');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

// Apply CORS middleware
app.use(cors()); 

// Use body parser 
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Code for the cloudinary file upload
app.use(fileupload({
    useTempFiles: true
}));

// Calling router for the router    
app.use('/student', studentroute);
app.use('/faculty', facultyroute);
app.use('/product', productroute);
app.use('/', signuproute);

// For the bad URL
app.use((req, res, next) => { 
    res.status(404).json({
        msg: "bad request"
    });
});

// Connect to the database using mongoose
mongoose.connect('mongodb+srv://ps:priya123@cluster0.nxbgw6r.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected with the database successfully');
        
        // Start the server only after the DB connection is established
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.log('Connection failed!', err);
    });

// Export the app for use in another file
module.exports = app;
