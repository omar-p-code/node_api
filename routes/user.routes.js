import express from 'express';
import * as usersController from "../controllers/users.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import multer from 'multer';
import appError from "../utils/appError.js"

const diskStorage = multer.diskStorage({
   destination: function (req, file, cb) {
      console.log('File', file)
      cb(null, 'uploads/')
   },
   filename: function (req, file, cb) {
      const fileName = `user-${Date.now()}.${file.mimetype.split('/')[1]}`; 
      cb(null, fileName)
   } 
})

const fileFilter = (req, file, cb) => {
   if (file.mimetype.startsWith('image')) {
      cb(null, true);
   } else {
      cb(appError.create('The File Must Be An Image', 404), false);
   }
}
const upload = multer({
   storage: diskStorage,
   fileFilter: fileFilter
})

const router = express.Router();

// get all users

// register

// login

router.route('/')
   .get(verifyToken ,usersController.getAllUsers)
   // Create A New Course

router.route('/register')
   .post(upload.single('avatar') ,usersController.register)

router.route('/login')
   .post(usersController.login)

export {router};
