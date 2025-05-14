const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT
});

connection.connect((error) =>{
  if (error){
    console.log(err.message)
  }
  // console.log('db' + connection.state);
});

class DbService{
  static getDbServiceInstance(){

    return instance ? instance : new DbService();

  }

  async getAllDta(){

    try {
        const response = await new Promise ((resolve, reject) => {
          const query = " SELECT * FROM blagues";
          connection.query(query, (err, results)=> {

            if (err) reject (new Error(err.message));
            resolve(results);
          })
        });
        // console.log(response);
        return response ;

    }catch (error){
      console.log(erreur)
    }
  }
}

module.exports = DbService;
