//This is the entry point of our backend server
//1. Importing dependencies
const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const mongoose = require('mongoose');

//2. Load Environment Variables 
//This line loads the variables from our .env file  into process.env
dotenv.config();

//3. Initialize Express App
const app = express();

//4. Middleware
// CORS allows our React frontend to make requests to this backend.
app.use(cors());
// This allows the server to understand incoming JSON data.
app.use(express.json());

//5. Database Connection
//We get the connection string from the environment variables
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit the process with failure
    });

//6. Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

//7. Define a simple test route
app.get('/', (req, res) => {
    res.send('Bhasha API is running...');
});

//8.Start the Server
//We get the port from the environment variables or default to 5001
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
