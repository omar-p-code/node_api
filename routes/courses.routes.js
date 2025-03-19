import express from 'express';

import * as coursesController from '../controllers/courses.controller.js';
import {validationSchema} from '../middlewares/validationSchema.js';
import verifyToken from "../middlewares/verifyToken.js";
import userRoles from "../utils/userRoles.js";
import allowedTo from "../middlewares/allowedTo.js";
const router = express.Router();

// Get All Courses
// Route -> Resource
router.route('/')
            .get(verifyToken,coursesController.getAllCourses)
            // Create A New Course
            .post(verifyToken,allowedTo(userRoles.MANAGER), validationSchema(),coursesController.addCourse)


router.route('/:id')
        // Get Single Course
        .get(coursesController.getCourse)
        // Update counterReset: 
        .patch(verifyToken, allowedTo(userRoles.MANAGER),coursesController.updataCourse)
        // Delete A Course 
        .delete(verifyToken, allowedTo(userRoles.MANAGER),coursesController.deleteCourse)

export {
    router
}