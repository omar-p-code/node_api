import asyncWrapper from "../middlewares/asyncWrapper.js";
import userquery from "../models/user.model.js";
import httpStatusText from "../utils/httpStatusText.js";
import appError from "../utils/appError.js";

const getAllUsers = asyncWrapper(async (req, res, next)=> {
   let que = req.query
   console.log("query", que)
   // get All Courses From Database
   // const courses = await Course.find()
   const user = new userquery('omar', 'elsyed', 'omaraldyb2020@gmail.com', "puppetmaster");
   const limit = que.limit || 2;
   const page = que.page || 1;
   const skip = (page - 1) * limit;
   const courses = user.getAll();

   courses.then((result)=> {
      // console.log("courses", result)
      res.json({status: httpStatusText.SUCCESS, data: {courses:result}});
   })
})


const register = asyncWrapper(async (req, res, next)=> {
   let que = req.query;
   // get All Courses From Database
   // const courses = await Course.find()
   const user = new userquery(que.fname, que.lname, que.email, que.password);
   user.userQuery(`SELECT * FROM users WHERE email='${que.email}';`).then(result => {
      if (result.length > 0) {
         let err = appError.create("User Already Exist", 400, httpStatusText.FAIL);
         next(err);
         return;
      }
   });
   const courses = user.save()
   courses.then((result)=> {
      // console.log("courses", result)
      res.json({status: httpStatusText.SUCCESS, data: {courses:result}});
   }).catch(err => {
      next(err);
   });
})

const login = () => {}

export {
   getAllUsers,
   register,
   login
}