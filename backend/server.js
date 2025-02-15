const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend domain
    credentials: true,
}));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
