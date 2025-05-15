// Server/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); // Charge les variables d'environnement

const DbService = require('./dbService'); // Importe votre service de base de données

const app = express();

// Middlewares
app.use(cors()); // Autorise les requêtes de différentes origines
app.use(express.json()); // Permet à Express de parser les corps de requêtes JSON
app.use(express.urlencoded({ extended: false })); // Permet de parser les données d'URL encodées
app.use(express.static('public'));

// --- ROUTES API ---

// CREATE (Ajouter une blague)
app.post('/insert', async (req, res) => { // Renommé '/insert' pour plus de clarté
    const { blague, response } = req.body; // Récupère les données envoyées par le client

    // Validation simple côté serveur (peut être plus robuste)
    if (!blague || !response) {
        return res.status(400).json({ success: false, message: 'Les champs blague et response sont requis.' });
    }

    const db = DbService.getDbServiceInstance();

    try {
        const result = await db.insertNewJoke(blague, response); // Appelle la nouvelle méthode
        res.status(201).json({ success: true, data: result, message: 'Blague ajoutée avec succès.' });
    } catch (error) {
        console.error("Erreur lors de l'insertion de la blague :", error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur lors de l\'insertion.' });
    }
});

// READ (Obtenir toutes les blagues)
app.get('/getAll', async (req, res) => { // Utilisez 'async' pour la propreté
    const db = DbService.getDbServiceInstance();

    try {
        const data = await db.getAllData(); // Utilisez 'await' pour attendre la résolution de la promesse
        res.json({ data: data });
    } catch (err) {
        console.error("Erreur lors de la récupération des blagues :", err);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur lors de la récupération.' });
    }
});

// UPDATE 
app.patch('/update/:id', (req, res) => { /* ... */ });

// DELETE 
app.delete('/delete/:id', (req, res) => { /* ... */ });

// Lancez le serveur
const PORT = process.env.PORT || 5000; // Utilise le port de .env ou 5000 par défaut
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));