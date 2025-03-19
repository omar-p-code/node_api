import jwt from "jsonwebtoken";
import httpStatusText from "../utils/httpStatusText.js";
import appError from "../utils/appError.js";

const verifyToken = (req, res, next) => {
      const authHeader = req.headers['Authorization'] || req.headers['authorization'];
      if (!authHeader) {
                  const error = appError.create('Token Is Required', 401, httpStatusText.ERROR);
         return next(error);
      }
      const token = authHeader.split(' ')[1]
      try {
         const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
         next();
      }catch(err) {
         const error = appError.create('Invalid Token', 401, httpStatusText.ERROR);
         return next(error);
      }
}

export default verifyToken;