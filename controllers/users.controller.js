import asyncWrapper from "../middlewares/asyncWrapper.js";
import userquery from "../models/user.model.js";
import httpStatusText from "../utils/httpStatusText.js";
import appError from "../utils/appError.js";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import generateJWT from "../utils/generate_jwt.js";

const getAllUsers = asyncWrapper(async (req, res, next)=> {
   let que = req.query
   // get All Courses From Database
   // const courses = await Course.find()
   const user = new userquery('omar', 'elsyed', 'omaraldyb2020@gmail.com', "puppetmaster");
   const limit = que.limit || 2;
   const page = que.page || 1;
   const skip = (page - 1) * limit;
   const courses = user.userQuery('SELECT firstName, lastName, email FROM users;');

   courses.then((result)=> {
      // console.log("courses", result)
      res.json({status: httpStatusText.SUCCESS, data: {courses:result}});
   })
})


const register = asyncWrapper(async (req, res, next)=> {
   let {fname, lname, email, password, role} = req.body;
   // get All Courses From Database
   // const courses = await Course.find()
   // Password Hashing
   // bcrypt.hash(s, salt) => s -> Script, salt -> Random String To Make The Hashing Algorithm Unpredictable 
   const hashedPassword = await bcrypt.hash(password, 10)
   const user = new userquery(fname, lname, email, hashedPassword, "token", role || "USER", req.file.filename);

   await user.userQuery(`SELECT * FROM users WHERE email='${email}';`).then(result => {
      if (result.length > 0) {
         let err = appError.create("User Already Exist", 400, httpStatusText.FAIL);
         return next(err);
      }
   });

   // Generate JWT token
   // jwt.sign(payload, SecretOrPrivateKey)
   const token = await generateJWT({email: user.email, role: user.role})
   console.log(token);
   user.token = token;

   const courses = user.save()
   courses.then((result)=> {
      // console.log("courses", result)
      res.status(201).json({status: httpStatusText.SUCCESS, data: {Users:result}});
   }).catch(err => {
      next(err);
   });
})

const login = asyncWrapper(async (req, res, next) => {
   const {email, password} = req.body;

   if (!email && !password) {
      const error = appError.create("Email And Password Are required", 400, httpStatusText.FAIL)
      return next(error)
   }

   const user = new userquery();
   const result = await user.userQuery(`SELECT * FROM users WHERE email='${email}';`);
   if (result.length === 0) {
      return next(appError.create("User Not Found", 400, httpStatusText.FAIL))
   }
   const isMatched = await bcrypt.compare(password, result[0].password);
   if (!isMatched) {
      return next(appError.create("Incorrect Password", 400, httpStatusText.FAIL))
   }
   delete result[0].password
   if (user && isMatched) {
      const token = await generateJWT({email: result[0].email, role: result[0].role});
      user.userQuery(`UPDATE users SET token='${token}' WHERE email='${email}';`);
      return res.status(200).json({status: httpStatusText.SUCCESS,msg: "Logged Successfully", data: {token}});
   }
});

export {
   getAllUsers,
   register,
   login
}