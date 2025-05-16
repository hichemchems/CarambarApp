// public/index.js

// --- 1. Récupération des Éléments du DOM ---
// Éléments pour l'affichage et la navigation des blagues
const blaguesContainer = document.getElementById('blaguesContainer');
const boutonNouvelleBlague = document.getElementById('boutonNouvelleBlague');
const boutonBlagueSuivante = document.getElementById('boutonBlagueSuivante'); 

// Éléments pour la popup de réponse
const popupReponse = document.getElementById('popupReponse');
const contenuReponse = document.getElementById('contenuReponse');
const fermerPopup = document.getElementById('fermerPopup');

// Éléments pour la MODALE D'AJOUT DE BLAGUE
const ajouterBlagueBDDButton = document.getElementById('ajouterBlagueBDD');
const addJokeModal = document.getElementById('addJokeModal');
const closeModalSpan = document.querySelector('.close-modal');

// Éléments pour le formulaire d'ajout de blague (à l'intérieur de la modale)
const addbtn = document.querySelector('#ajout-btn');
const newBlagueInput = document.querySelector('#NewBlague');
const newResponseInput = document.querySelector('#NewResponse');

const imageReponseSrc = './assete/img/response.png';

// --- 2. Données des Blagues ---
let toutesLesBlagues = [];
let blaguesOrdonnees = []; 
let currentJokeIndex = 0; 
const blaguesStatiques = [
    { id: 1, blagues: "Quelle est la femelle du hamster ?", response: "L’Amsterdam" },
    { id: 2, blagues: "Que dit un oignon quand il se cogne ?", response: "Aïe" },
    { id: 3, blagues: "Quel est l'animal le plus heureux ?", response: "Le hibou, parce que sa femme est chouette." },
    { id: 4, blagues: "Pourquoi le football c'est rigolo ?", response: "Parce que Thierry en rit" },
    { id: 5, blagues: "Quel est le sport le plus fruité ?", response: "La boxe, parce que tu te prends des pêches dans la poire et tu tombes dans les pommes." },
    { id: 6, blagues: "Que se fait un Schtroumpf quand il tombe ?", response: "Un Bleu" },
    { id: 7, blagues: "Quel est le comble pour un marin ?", response: "Avoir le nez qui coule" },
    { id: 8, blagues: "Qu'est ce que les enfants usent le plus à l'école ?", response: "Le professeur" },
    { id: 9, blagues: "Quel est le sport le plus silencieux ?", response: "Le para-chuuuut" },
    { id: 10, blagues: "Quel est le comble pour un joueur de bowling ?", response: "C’est de perdre la boule" }
];

// --- 3. Initialisation de l'Application ---
document.addEventListener('DOMContentLoaded', async function() {
    // Vérifie que tous les éléments essentiels existent avant de les utiliser
    if (!blaguesContainer || !boutonNouvelleBlague || !boutonBlagueSuivante || !popupReponse || !contenuReponse || !fermerPopup ||
        !ajouterBlagueBDDButton || !addJokeModal || !closeModalSpan || !addbtn || !newBlagueInput || !newResponseInput) {
        console.error("Un ou plusieurs éléments nécessaires n'ont pas été trouvés.");
        if (blaguesContainer) {
            blaguesContainer.innerHTML = '<p>Erreur: L\'application ne peut pas démarrer correctement. Vérifiez la console pour plus de détails.</p>';
        }
        return;
    }

    await chargerToutesLesBlagues(); // Charge les blagues au démarrage (DB + statiques)
    afficherBlagueAleatoire();        // Affiche une première blague aléatoire

    // Ajout des écouteurs d'événements
    boutonNouvelleBlague.addEventListener('click', afficherBlagueAleatoire);
    boutonBlagueSuivante.addEventListener('click', afficherBlagueSuivante);
    fermerPopup.addEventListener('click', fermerLaPopup);
    addbtn.onclick = handleAddJoke;

    // Écouteurs d'événements pour la MODALE
    ajouterBlagueBDDButton.addEventListener('click', openAddJokeModal);
    closeModalSpan.addEventListener('click', closeAddJokeModal);
    addJokeModal.addEventListener('click', (event) => {
        if (event.target === addJokeModal) {
            closeAddJokeModal();
        }
    });
});

// --- 4. Fonctions de Gestion des Blagues ---

async function chargerToutesLesBlagues() {
    // Commence par les blagues statiques
    toutesLesBlagues = [...blaguesStatiques];
    blaguesOrdonnees = [...blaguesStatiques]; 

    try {
        const response = await fetch('http://localhost:5000/getAll');
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur HTTP: ${response.status} - ${errorText || 'Réponse du serveur non lisible.'}`);
        }
        const data = await response.json();

        if (data && Array.isArray(data.data) && data.data.length > 0) {
            // Pour les blagues de la BDD, assurez-vous qu'elles ont bien un 'id'
            // et que leurs propriétés correspondent à 'blagues' et 'response'.
            // Si votre base de données utilise 'blague_text' au lieu de 'blagues',
            // ou 'reponse_text' au lieu de 'response', vous devrez adapter ici.
            const jokesFromDb = data.data.map(joke => ({
                id: joke.id, // Assurez-vous que l'ID est correct
                blagues: joke.blagues, // Assurez-vous que le nom de colonne est correct
                response: joke.response // Assurez-vous que le nom de colonne est correct
            }));

            toutesLesBlagues = toutesLesBlagues.concat(jokesFromDb);
            blaguesOrdonnees = blaguesOrdonnees.concat(jokesFromDb);
            console.log(`Blagues chargées depuis la DB : ${jokesFromDb.length}`);
        } else {
            console.log('Aucune blague à charger depuis la base de données ou données non valides.');
        }
    } catch (error) {
        console.error('Erreur lors du chargement des blagues depuis la DB:', error);
        if (blaguesContainer) {
            blaguesContainer.innerHTML = '<p>Impossible de charger les blagues pour le moment. Veuillez réessayer plus tard. (Erreur DB)</p>';
        }
    }

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
    blaguesContainer.innerHTML = '';
    const indexAleatoire = Math.floor(Math.random() * toutesLesBlagues.length);
    const blagueAffichee = toutesLesBlagues[indexAleatoire];
    renderJoke(blagueAffichee);
}

/**
 * Affiche la blague suivante dans l'ordre séquentiel.
 */
function afficherBlagueSuivante() {
    if (blaguesOrdonnees.length === 0) {
        if (blaguesContainer) {
            blaguesContainer.innerHTML = '<p>Aucune blague disponible pour le moment.</p>';
        }
        return;
    }

    blaguesContainer.innerHTML = '';

    if (currentJokeIndex >= blaguesOrdonnees.length) {
        currentJokeIndex = 0;
    }

    const blagueAffichee = blaguesOrdonnees[currentJokeIndex];
    renderJoke(blagueAffichee);

    currentJokeIndex++;
}

/**
 * Fonction générique pour rendre une blague dans le DOM.
 * @param {object} blague - L'objet blague à afficher. Doit avoir au moins 'blagues' et 'response',
 * et éventuellement 'id'.
 */
function renderJoke(blague) {
    const blagueDiv = document.createElement('div');
    blagueDiv.classList.add('blague-container');

    const questionElement = document.createElement('p');
    
    // NOUVEAU : Affiche l'ID si disponible, sinon ne l'affiche pas
    let blagueText = "";
    if (blague.id !== undefined && blague.id !== null) {
        blagueText += `${blague.id} `;
    }
    blagueText += blague.blagues; // Le texte de la blague sans l'ID déjà intégré
    
    questionElement.textContent = blagueText;

    const imageElement = document.createElement('img');
    imageElement.src = imageReponseSrc;
    imageElement.classList.add('reponse-image');

    imageElement.addEventListener('click', function() {
        afficherReponse(blague.response);
    });

    blagueDiv.appendChild(questionElement);
    blagueDiv.appendChild(imageElement);
    blaguesContainer.appendChild(blagueDiv);
}

function afficherReponse(reponse) {
    contenuReponse.textContent = reponse;
    popupReponse.style.display = 'block';
}

function fermerLaPopup() {
    popupReponse.style.display = 'none';
}

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

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur HTTP lors de l'ajout: ${response.status} - ${errorText || 'Réponse du serveur non lisible.'}`);
        }

        const result = await response.json();

        if (result.success) {
            alert('Blague ajoutée avec succès !');
            newBlagueInput.value = '';
            newResponseInput.value = '';
            closeAddJokeModal();

            const nouvelleBlagueObj = {
                id: result.data.id || null, // L'ID doit être retourné par votre API Node.js/DB
                blagues: blagueValue,
                response: responseValue,
                date_création: new Date().toISOString()
            };

            toutesLesBlagues.push(nouvelleBlagueObj);
            blaguesOrdonnees.push(nouvelleBlagueObj);

            shuffleArray(toutesLesBlagues);
            afficherBlagueAleatoire();
        } else {
            alert('Erreur lors de l\'ajout de la blague : ' + (result.message || 'Erreur inconnue.'));
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi des données :', error);
        alert('Une erreur est survenue lors de la communication avec le serveur. Vérifiez la console pour plus de détails.');
    }
}

// --- Fonctions de Gestion de la Modale ---

function openAddJokeModal() {
    addJokeModal.style.display = 'flex';
}

function closeAddJokeModal() {
    addJokeModal.style.display = 'none';
}