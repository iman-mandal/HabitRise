const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

const connectToDB=require('./db');
connectToDB();

app.use(express.urlencoded({extended:true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

//import from routes
const userRoutes=require('./routes/userRoutes');
const habitRoutes=require('./routes/habitsRoutes');

//use routes in app
app.use('/user',userRoutes);
app.use('/habit',habitRoutes);


module.exports = app;