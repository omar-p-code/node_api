import express from 'express';
import * as usersController from "../controllers/users.controller.js";

const router = express.Router();

// get all users

// register

// login

router.route('/')
   .get(usersController.getAllUsers)
   // Create A New Course

router.route('/register')
   .post(usersController.register)

router.route('/login')
   .post(usersController.login)

export {router};
