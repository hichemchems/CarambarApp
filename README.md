# CarambarApp

#Prérequis

Pour exécuter cette application, vous devez avoir installé les éléments suivants :
Visual Studio
Node.js : v18 ou supérieur
npm : v8 ou supérieur
MySQL : v8.0 ou supérieur


#Description

Cette application est un serveur construit avec Node.js, Express et MySQL. 
Elle inclut les dépendances nécessaires pour gérer les requêtes HTTP, 
les interactions avec la base de données et la configuration de l'environnement.

#Fonctionnalités

Connexion à la base de données : Connectivité à une base de données MySQL.

API RESTful : Prise en charge de la création d'une API RESTful avec Express.

Gestion des dépendances : Utilisation de npm pour gérer les dépendances.

#Installation

Instructions pour installer et exécuter l'application.

Clonez le dépôt 

Installez les dépendances : npm install

Configurez les variables d'environnement :

Créez un fichier .env à la racine du projet.

#Créez une BDD MYSQL " blaguesBDD "  

une table "Carambare_blagues"  

avec (id, blagues,  date_création, response) 

Ajoutez les variables d'environnement nécessaires (par exemple, les détails de la base de données).

#PORT=5000

#DB_HOST=localhost

#DB_USER=votre_nom_d'utilisateur

#DB_PASSWORD=votre_mot_de_passe

#DB_NAME=nom_de_la_base_de_données

#Exécutez l'application : depuis le terminal "cd server" et dans le dossier server "nodemon app" en environement developpement
 (ou npm run dev si vous avez configuré nodemon)


