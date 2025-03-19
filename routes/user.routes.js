import express from 'express';
import * as usersController from "../controllers/users.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

// get all users

// register

// login

router.route('/')
   .get(verifyToken ,usersController.getAllUsers)
   // Create A New Course

router.route('/register')
   .post(usersController.register)

router.route('/login')
   .post(usersController.login)

export {router};
