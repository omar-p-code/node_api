import jwt from "jsonwebtoken";

export default async (pyload) => {
   const token = jwt.sign(pyload, process.env.JWT_SECRET_KEY, {expiresIn: '30d'});
   return token;
}