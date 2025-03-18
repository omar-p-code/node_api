// import fs from 'node:fs';
import {validationResult} from 'express-validator';
import asyncWrapper from '../middlewares/asyncWrapper.js';
// const dataPath = './data/courses.json';
// import Course from '../models/course.model.js';
import query from '../models/course.model.js';
import httpStatusText from '../utils/httpStatusText.js';
import appError from "../utils/appError.js";

const getAllCourses = asyncWrapper(async (req, res, next)=> {
    let que = req.query
    console.log("query", que)
    // get All Courses From Database
    // const courses = await Course.find()
    const limit = que.limit || 2;
    const page = que.page || 1;
    const skip = (page - 1) * limit;
    const courses = query(`SELECT * FROM courses ORDER BY id LIMIT ${limit} OFFSET ${skip};`)
    courses.then((result)=> {
        // console.log("courses", result)
        res.json({status: httpStatusText.SUCCESS, data: {courses:result}});
    })
})

const getCourse = asyncWrapper(
    async (req, res, next) => {
    // console.log(req.params.id)
        // const course = await Course.findById(req.params.id)
        await query(`SELECT * FROM courses WHERE id='${req.params.id}';`).then(result => {
            // console.log(typeof result, result.length)
        if (result.length <= 0) {
            const error = appError.create("Course Not Found", 404, httpStatusText.FAIL)
            return next(error)
            // return res.status(404).json({status: httpStatusText.FAIL, 'data': 'Course Not Found'})
        }
        else res.json({status: httpStatusText.SUCCESS, data: {course: result}})
        })
        // .catch(reas => {
        //     return res.status(400).json({status: httpStatusText.ERROR, data: "Invalid Object Id", reason: reas})
        // })
})

const addCourse = asyncWrapper(
    async (req, res, next) => {
    const id = query('SELECT * FROM courses;');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
        return next(error)
        // return res.status(400).json({status: httpStatusText.FAIL, data: errors.array()})
    } 
    const newCourse = {...req.body};
    id.then(async () => {
        await query(`INSERT INTO courses(id, title, price) VALUES(UUID(),'${newCourse.title}',${newCourse.price});`)
        query('SELECT * FROM courses ORDER BY id DESC limit 1;').then(result => {
            res.status(201).json({status: httpStatusText.SUCCESS, data: {course: result}})
        })
    })
    // const newCourse = new Course(req.body)
    // await newCourse.save()
}
)

const updataCourse = asyncWrapper(
    async (req, res, next) => {
    let id = req.params.id;
    let title = req.body.title;
    let price = req.body.price
        // const updatedCourse = await Course.updateOne({_id: id}, {$set: {...req.body}})
        if (title) await query(`UPDATE courses SET title='${title}' WHERE id='${id}';`)
        if (price) await query(`UPDATE courses SET price=${price} WHERE id='${id}';`)
        await query(`SELECT * FROM courses WHERE id='${id}';`).then(result => {
            return res.status(200).json({status: httpStatusText.SUCCESS, data: {course: result}})
})})

const deleteCourse = asyncWrapper(
    async (req,res, next) => {
    let id = req.params.id;
    // const data = await Course.deleteOne({_id: id})
    query(`DELETE FROM courses WHERE id='${id}';`).then(result => {
        if (result.affectedRows <= 0) {
            const error = appError.create("Course Not Found", 404, httpStatusText.FAIL);
            return next(error)
            // return res.status(404).json({status: httpStatusText.FAIL, data: 'Course Not Found'})
        }
        console.log(result)
        res.json({status: httpStatusText.SUCCESS, data: null})
    }).catch(reason => {
        res.json({status: httpStatusText.FAIL, data: reason})
    })
}
)



// function saveData(data) {
//     try{
//         return fs.writeFileSync(dataPath,JSON.stringify(data))
//     }catch{
//         return Error('the Value Not Valid')
//     }
// }




export {
    deleteCourse,
    updataCourse,
    addCourse,
    getCourse,
    getAllCourses
}