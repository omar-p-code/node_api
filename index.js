import express from 'express';
import env from "dotenv";
import httpStatusText from './utils/httpStatusText.js';
import cors from "cors";

env.config()
const app = express();
// import mongoose from 'mongoose';
import mysql from 'mysql2';
const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

// console.log("process",  process.env.PASSWORD)

con.connect(err => {
    if (err) throw err
    console.log("MySQL Connected")
})


// const url = "mongodb+srv://Yama:puppetmaster0C%40@learnmongodb.gs7br.mongodb.net/codeZone?retryWrites=true&w=majority&appName=LearnMongoDB"

// mongoose.connect(url).then(() => {
//     console.log('mongodb server started')
// })

app.use(cors())
app.use(express.json());
// CRUD (Create / Read / Update / Delete)

import {router as  coursesRoutes} from './routes/courses.routes.js';
import {router as userRouter} from "./routes/user.routes.js";

app.use('/api/courses', coursesRoutes); // api/courses
app.use('/api/users', userRouter); // /api/users

// global middleware for not found router
app.all('*', (req, res, next) => {
    res.status(404).json({status: httpStatusText.ERROR, msg: "This resource Is Not Available"});
})

// global error handler
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({status: err.statusText || httpStatusText.ERROR, msg: err.message, code: err.statusCode, data: null})
})

app.listen(process.env.PORT || 4000, () => {
    console.log('listening on Port 4000')
})
/**
 * 
 * @param {arr} data
 * @returns json file at the CWD
 */
