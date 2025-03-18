// import mongoose from 'mongoose';
import mysql from "mysql2";

// const courseSchema = new mongoose.Schema({
//    title: {
//       type: String,
//       required: true
//    },
//    price: {
//       type: Number,
//       required: true
//    }
// })

// export default mongoose.model('Course', courseSchema)

function query(sql, db="node_mysql" , returns=true, host="localhost", user="root", password='puppetmaster0C@') {
const prom = new Promise((res, rej) => {
      const con = mysql.createConnection({
   host: host,
   user: user,
   password: password,
   database: db
});
con.connect(err => {
   if (err) rej(Error(err));
   con.query("CREATE TABLE IF NOT EXISTS courses(id VARCHAR(255), title VARCHAR(255), price INT);", (err, result) => {
      if (err) throw err
      console.log(result)
   })
   con.query(sql, (err, result) => {
      if (err) rej(Error(err));
      // console.log("result", result)
      res(result);
   });
   con.end()
});
});
return prom
}


export default query