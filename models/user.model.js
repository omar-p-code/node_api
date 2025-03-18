import mysql from "mysql2";
import validator from "validator";
import asyncWrapper from "../middlewares/asyncWrapper.js";


class Users {
   constructor(firstName, lastName, email, password) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.password = password;
   }

userQuery(sql ,db="node_mysql" , returns=true, host="localhost", user="root", password='puppetmaster0C@') {
const prom = new Promise((res, rej) => {
      const con = mysql.createConnection({
   host: host,
   user: user,
   password: password,
   database: db
});
con.connect(err => {
   if (err) rej(Error(err));
   con.query("CREATE TABLE IF NOT EXISTS users(firstName VARCHAR(255), lastName VARCHAR(255), email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL);", (err, result) => {
      if (err) throw err
      console.log(result)
      con.query(sql, (err, result) => {
            if (err) rej(Error(err));
            // console.log("result", result)
            res(result);
            con.end()
         });
      });
   });
});
return prom
}
async save() {
   if (!validator.isEmail(this.email)) throw Error('Not Valid Email')
   return [await this.userQuery(`INSERT INTO users(firstName, lastName, email, password) values('${this.firstName}', '${this.lastName}', '${this.email}', '${this.password}');`), {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
   }];

}
async getAll() {
 return await this.userQuery(`SELECT * FROM users;`); 
}
}


export default Users