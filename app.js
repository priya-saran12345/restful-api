const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fileupload = require('express-fileupload');
const bodyParser = require('body-parser');

const app = express();

// CORS configuration
app.use(cors({
    origin: 'https://crud-wheat-theta.vercel.app', // Your allowed origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Include if you need to send cookies or headers
}));

app.options('*', cors()); // Enable preflight requests for all routes

// MongoDB connection
mongoose.connect('mongodb+srv://ps:priya123@cluster0.nxbgw6r.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to the database successfully'))
.catch(err => console.error('Connection failed:', err));

// Middleware
app.use(fileupload({ useTempFiles: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/student', studentRoute);
app.use('/faculty', facultyRoute);
app.use('/product', productRoute);
app.use('/', signUpRoute);

// Handle 404
app.use((req, res) => {
    res.status(404).json({ msg: "Bad request" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export the app
module.exports = app;
