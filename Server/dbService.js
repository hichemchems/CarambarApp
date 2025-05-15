// Server/dbService.js
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

let instance = null;

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT
});

connection.connect((error) => {
  if (error) {
    console.error('Erreur de connexion à la base de données:', error.message);
    return;
  }
  console.log('Connecté à la base de données ! État : ' + connection.state);
});

class DbService {
  static getDbServiceInstance() {
    if (!instance) {
      instance = new DbService();
    }
    return instance;
  }

  async getAllDta() {
    try {
      const response = await new Promise((resolve, reject) => {
        // Correction du nom de la table ici
        const query = "SELECT * FROM Carambare_blagues";
        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.error("Erreur dans getAllDta:", error);
      throw error;
    }
  }

  async insertNewJoke(blague, response) {
    try {
      const date_creation = new Date();
      const insertResult = await new Promise((resolve, reject) => {
        // Correction du nom de la table ici
        const query = "INSERT INTO Carambare_blagues (blagues, response, date_creation) VALUES (?, ?, ?)";
        connection.query(query, [blague, response, date_creation], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.insertId);
        });
      });
      return {
        id: insertResult,
        blagues: blague,
        response: response,
        date_creation: date_creation
      };
    } catch (error) {
      console.error("Erreur dans insertNewJoke:", error);
      throw error;
    }
  }
}

module.exports = DbService;

