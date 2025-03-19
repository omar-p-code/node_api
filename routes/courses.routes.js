import express from 'express';

import * as coursesController from '../controllers/courses.controller.js';
import {validationSchema} from '../middlewares/validationSchema.js';
import verifyToken from "../middlewares/verifyToken.js";
const router = express.Router();

// Get All Courses
// Route -> Resource
router.route('/')
            .get(verifyToken ,coursesController.getAllCourses)
            // Create A New Course
            .post(validationSchema(),coursesController.addCourse)


router.route('/:id')
        // Get Single Course
        .get(coursesController.getCourse)
        // Update counterReset: 
        .patch(coursesController.updataCourse)
        // Delete A Course 
        .delete(coursesController.deleteCourse)

export {
    router
}