import mysql from "mysql2";
import validator from "validator";
import asyncWrapper from "../middlewares/asyncWrapper.js";


class Users {
   constructor(firstName, lastName, email, password, token) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.password = password;
   this.token = token
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
   con.query("CREATE TABLE IF NOT EXISTS users(id VARCHAR(36) NOT NULL DEFAULT (UUID()),firstName VARCHAR(255), lastName VARCHAR(255), email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, token VARCHAR(255), PRIMARY KEY (id));", (err, result) => {
      if (err) throw err;
      console.log(result);
      const resultQuery = `SELECT * FROM users WHERE email='${this.email}';`
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
   return [await this.userQuery(`INSERT INTO users(firstName, lastName, email, password, token) values('${this.firstName}', '${this.lastName}', '${this.email}', '${this.password}', '${this.token}');`), {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      token: this.token
   }];

}
async getAll() {
 return await this.userQuery(`SELECT * FROM users;`); 
}
}


export default Users