const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');

const studentRoute = require('./api/routes/student');
const facultyRoute = require('./api/routes/faculty');
const productRoute = require('./api/routes/product');
const signUpRoute = require('./api/routes/user');

const app = express();

// Apply CORS middleware
app.use(cors());

// Database connection
mongoose.connect('mongodb+srv://ps:priya123@cluster0.nxbgw6r.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Middleware for file upload
app.use(fileupload({ useTempFiles: true }));

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route handlers
app.use('/student', studentRoute);
app.use('/faculty', facultyRoute);
app.use('/product', productRoute);
app.use('/', signUpRoute);

// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).json({ msg: "Bad request" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);  // Log the error stack
    res.status(500).json({ error: 'Internal Server Error' });
});

// Export the app for use in another file
module.exports = app;
