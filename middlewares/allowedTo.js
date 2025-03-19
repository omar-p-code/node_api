import appError from "../utils/appError.js";

export default (...roles) => {
   console.log(roles)
   return (req, res, next) => {
      if (!roles.includes(req.currentUser.role)) {
         return next(appError.create('This Role Is Not Authorized', 401))
      }
      next();
   }
}