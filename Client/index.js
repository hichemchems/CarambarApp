

// --- 1. Récupération des Éléments du DOM ---
// Éléments pour l'affichage et la navigation des blagues
const blaguesContainer = document.getElementById('blaguesContainer');
const boutonNouvelleBlague = document.getElementById('boutonNouvelleBlague');

// Éléments pour la popup de réponse
const popupReponse = document.getElementById('popupReponse');
const contenuReponse = document.getElementById('contenuReponse');
const fermerPopup = document.getElementById('fermerPopup');

// Éléments pour le formulaire d'ajout de blague
const addbtn = document.querySelector('#ajout-btn');
const newBlagueInput = document.querySelector('#NewBlague');
const newResponseInput = document.querySelector('#NewResponse');

// Chemin de l'image pour l'icône de réponse (assure-toi que ce chemin est correct)
const imageReponseSrc = './assete/img/response.png';

// --- 2. Données des Blagues ---
// Tableau global qui contiendra TOUTES les blagues (statiques + celles de la DB)
let toutesLesBlagues = [];

// Blagues statiques (Carambar) - Noms de propriétés : 'blagues' et 'response'
// pour être compatibles avec les données de la DB.
const blaguesStatiques = [
    { blagues: "1 Quelle est la femelle du hamster ?", response: "L’Amsterdam" },
    { blagues: "2 Que dit un oignon quand il se cogne ?", response: "Aïe" },
    { blagues: "3 Quel est l'animal le plus heureux ?", response: "Le hibou, parce que sa femme est chouette." },
    { blagues: "4 Pourquoi le football c'est rigolo ?", response: "Parce que Thierry en rit" },
    { blagues: "5 Quel est le sport le plus fruité ?", response: "La boxe, parce que tu te prends des pêches dans la poire et tu tombes dans les pommes." },
    { blagues: "6 Que se fait un Schtroumpf quand il tombe ?", response: "Un Bleu" },
    { blagues: "7 Quel est le comble pour un marin ?", response: "Avoir le nez qui coule" },
    { blagues: "8 Qu'est ce que les enfants usent le plus à l'école ?", response: "Le professeur" },
    { blagues: "9 Quel est le sport le plus silencieux ?", response: "Le para-chuuuut" },
    { blagues: "10 Quel est le comble pour un joueur de bowling ?", response: "C’est de perdre la boule" }
];

// --- 3. Initialisation de l'Application ---
document.addEventListener('DOMContentLoaded', async function() {
    // Vérifie que tous les éléments essentiels existent avant de les utiliser
    if (!blaguesContainer || !boutonNouvelleBlague || !popupReponse || !contenuReponse || !fermerPopup || !addbtn || !newBlagueInput || !newResponseInput) {
        console.error("Un ou plusieurs éléments HTML nécessaires n'ont pas été trouvés. Vérifiez les IDs/classes.");
        if (blaguesContainer) {
            blaguesContainer.innerHTML = '<p>Erreur: L\'application ne peut pas démarrer correctement. Vérifiez la console pour plus de détails.</p>';
        }
        return; // Arrête l'exécution si des éléments manquent
    }

    await chargerToutesLesBlagues(); // Charge les blagues au démarrage (DB + statiques)
    afficherBlagueAleatoire();        // Affiche une première blague
    
    // Ajout des écouteurs d'événements une fois que tous les éléments sont vérifiés
    boutonNouvelleBlague.addEventListener('click', afficherBlagueAleatoire);
    fermerPopup.addEventListener('click', fermerLaPopup);
    addbtn.onclick = handleAddJoke; // Attribue la fonction au clic du bouton d'ajout
});

// --- 4. Fonctions de Gestion des Blagues ---

/**
 * Charge toutes les blagues : d'abord les statiques, puis celles de la base de données.
 * Mélange le tableau final.
 */
async function chargerToutesLesBlagues() {
    // Commence par les blagues statiques
    toutesLesBlagues = [...blaguesStatiques];

    try {
        const response = await fetch('http://localhost:5000/getAll');
        // Vérifie si la réponse HTTP est OK (statut 2xx)
        if (!response.ok) {
            const errorText = await response.text(); // Tente de lire le corps de l'erreur du serveur
            throw new Error(`Erreur HTTP: ${response.status} - ${errorText || 'Réponse du serveur non lisible.'}`);
        }
        const data = await response.json();
        
        // Vérifie si les données de la DB sont valides et non vides
        if (data && Array.isArray(data.data) && data.data.length > 0) {
            toutesLesBlagues = toutesLesBlagues.concat(data.data); // Ajoute les blagues de la DB
            console.log(`Blagues chargées depuis la DB : ${data.data.length}`);
        } else {
            console.log('Aucune blague à charger depuis la base de données ou données non valides.');
        }
    } catch (error) {
        console.error('Erreur lors du chargement des blagues depuis la DB:', error);
        // Affiche un message à l'utilisateur si le chargement a échoué
        if (blaguesContainer) {
            blaguesContainer.innerHTML = '<p>Impossible de charger les blagues pour le moment. Veuillez réessayer plus tard. (Erreur DB)</p>';
        }
    }

    // Mélange le tableau complet des blagues pour un affichage aléatoire initial
    shuffleArray(toutesLesBlagues);
    console.log(`Nombre total de blagues disponibles : ${toutesLesBlagues.length}`);
}

/**
 * Affiche une blague aléatoire tirée du tableau `toutesLesBlagues`.
 */
function afficherBlagueAleatoire() {
    if (toutesLesBlagues.length === 0) {
        if (blaguesContainer) {
            blaguesContainer.innerHTML = '<p>Aucune blague disponible pour le moment.</p>';
        }
        return;
    }

    blaguesContainer.innerHTML = ''; // Vide le conteneur avant d'ajouter une nouvelle blague

    const indexAleatoire = Math.floor(Math.random() * toutesLesBlagues.length);
    const blagueAffichee = toutesLesBlagues[indexAleatoire];

    // Crée le conteneur pour la blague (utilise la classe existante 'blague-container')
    const blagueDiv = document.createElement('div');
    blagueDiv.classList.add('blague-container'); 

    // Crée l'élément question
    const questionElement = document.createElement('p');
    questionElement.textContent = blagueAffichee.blagues; // La propriété est 'blagues'

    // Crée l'image de réponse
    const imageElement = document.createElement('img');
    imageElement.src = imageReponseSrc;
    imageElement.classList.add('reponse-image'); 

    // Ajoute l'écouteur d'événement pour afficher la réponse au clic sur l'image
    imageElement.addEventListener('click', function() {
        afficherReponse(blagueAffichee.response); // La propriété est 'response'
    });

    // Ajoute les éléments au conteneur de blague, puis au DOM
    blagueDiv.appendChild(questionElement);
    blagueDiv.appendChild(imageElement);
    blaguesContainer.appendChild(blagueDiv);
}

/**
 * Affiche la popup avec la réponse de la blague.
 * @param {string} reponse - Le texte de la réponse à afficher.
 */
function afficherReponse(reponse) {
    contenuReponse.textContent = reponse;
    popupReponse.style.display = 'block'; // Affiche la popup
}

/**
 * Ferme la popup de réponse.
 */
function fermerLaPopup() {
    popupReponse.style.display = 'none'; // Cache la popup
}

/**
 * Fonction utilitaire pour mélanger un tableau (algorithme de Fisher-Yates).
 * @param {Array} array - Le tableau à mélanger.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- 5. Logique d'Ajout de Blague ---
async function handleAddJoke() {
    const blagueValue = newBlagueInput.value.trim();
    const responseValue = newResponseInput.value.trim();

    if (blagueValue === '' || responseValue === '') {
        alert('Veuillez remplir les deux champs : Blague et Réponse.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                blague: blagueValue,
                response: responseValue
            })
        });

        if (!response.ok) { // Vérifie si la réponse HTTP est OK (statut 2xx)
            const errorText = await response.text();
            throw new Error(`Erreur HTTP lors de l'ajout: ${response.status} - ${errorText || 'Réponse du serveur non lisible.'}`);
        }

        const result = await response.json(); // Analyse la réponse JSON du serveur

        if (result.success) {
            alert('Blague ajoutée avec succès !');
            // Réinitialise les champs du formulaire
            newBlagueInput.value = '';
            newResponseInput.value = '';

            // Ajoute la nouvelle blague au tableau en mémoire pour un affichage immédiat
            const nouvelleBlagueObj = {
                id: result.data.id || null, // Récupère l'ID si le serveur le renvoie
                blagues: blagueValue,
                response: responseValue,
                date_création: new Date().toISOString() // Simule la date pour l'affichage
            };
            toutesLesBlagues.push(nouvelleBlagueObj);
            shuffleArray(toutesLesBlagues); // Mélange à nouveau après l'ajout
            afficherBlagueAleatoire(); // Affiche la blague suivante (qui peut être la nouvelle)
        } else {
            alert('Erreur lors de l\'ajout de la blague : ' + (result.message || 'Erreur inconnue.'));
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi des données :', error);
        alert('Une erreur est survenue lors de la communication avec le serveur. Vérifiez la console pour plus de détails.');
    }
}