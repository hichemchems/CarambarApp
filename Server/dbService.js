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

  // CORRECTION 1: Renommer la méthode en getAllData
  async getAllData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM Carambare_blagues";
        connection.query(query, (err, results) => {
          if (err) {
            console.error("Erreur SQL dans getAllData:", err.message); // Ajout d'un log plus précis
            reject(new Error(err.message));
          }
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.error("Erreur dans getAllData service:", error); // Log pour les erreurs de promesse
      throw error;
    }
  }

  async insertNewJoke(blague, response) {
    try {
      const date_creation = new Date();
      const insertResult = await new Promise((resolve, reject) => {
        // CORRECTION 2: Changer 'date_creation' à 'date_création' pour correspondre au schéma de la table
        const query = "INSERT INTO Carambare_blagues (blagues, response, date_création) VALUES (?, ?, ?)";
        connection.query(query, [blague, response, date_creation], (err, result) => {
          if (err) {
            console.error("Erreur SQL dans insertNewJoke:", err.message); // Ajout d'un log plus précis
            reject(new Error(err.message));
          }
          resolve(result.insertId);
        });
      });
      return {
        id: insertResult,
        blagues: blague,
        response: response,
        date_création: date_creation // Renommage ici aussi si tu retournes la colonne
      };
    } catch (error) {
      console.error("Erreur dans insertNewJoke service:", error); // Log pour les erreurs de promesse
      throw error;
    }
  }
}

module.exports = DbService;