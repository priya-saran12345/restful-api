const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fileupload = require('express-fileupload');
const bodyParser = require('body-parser');

const studentRoute = require('./api/routes/student');
const facultyRoute = require('./api/routes/faculty');
const productRoute = require('./api/routes/product');
const signUpRoute = require('./api/routes/user');

const app = express();

// CORS configuration
app.use(cors({
    origin: 'https://crud-wheat-theta.vercel.app/', // Replace with your client origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// File upload middleware
app.use(fileupload({ useTempFiles: true }));

// Connect to MongoDB
mongoose.connect('mongodb+srv://ps:priya123@cluster0.nxbgw6r.mongodb.net/', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => {
    console.log('Connected to the database successfully');
})
.catch(err => {
    console.error('Connection failed:', err);
});

// Middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register routes
app.use('/student', studentRoute);
app.use('/faculty', facultyRoute);
app.use('/product', productRoute);
app.use('/', signUpRoute);

// 404 error handling
app.use((req, res, next) => { 
    res.status(404).json({ msg: "Bad request" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export the app for use in another file
module.exports = app;

