// public/index.js

// --- 1. Récupération des Éléments du DOM ---
// Éléments pour l'affichage et la navigation des blagues
const blaguesContainer = document.getElementById('blaguesContainer');
const boutonNouvelleBlague = document.getElementById('boutonNouvelleBlague');

// Éléments pour la popup de réponse
const popupReponse = document.getElementById('popupReponse');
const contenuReponse = document.getElementById('contenuReponse');
const fermerPopup = document.getElementById('fermerPopup');

// Éléments pour la MODALE D'AJOUT DE BLAGUE
const ajouterBlagueBDDButton = document.getElementById('ajouterBlagueBDD'); // Nouveau bouton déclencheur
const addJokeModal = document.getElementById('addJokeModal');             // L'overlay de la modale
const closeModalSpan = document.querySelector('.close-modal');            // La croix pour fermer la modale

// Éléments pour le formulaire d'ajout de blague (à l'intérieur de la modale)
const addbtn = document.querySelector('#ajout-btn');
const newBlagueInput = document.querySelector('#NewBlague');
const newResponseInput = document.querySelector('#NewResponse');

// Chemin de l'image pour l'icône de réponse (assure-toi que ce chemin est correct)
const imageReponseSrc = './assete/img/response.png';

// --- 2. Données des Blagues ---
let toutesLesBlagues = [];

const blaguesStatiques = [
    { blagues: " Quelle est la femelle du hamster ?", response: "L’Amsterdam" },
    { blagues: " Que dit un oignon quand il se cogne ?", response: "Aïe" },
    { blagues: " Quel est l'animal le plus heureux ?", response: "Le hibou, parce que sa femme est chouette." },
    { blagues: " Pourquoi le football c'est rigolo ?", response: "Parce que Thierry en rit" },
    { blagues: " Quel est le sport le plus fruité ?", response: "La boxe, parce que tu te prends des pêches dans la poire et tu tombes dans les pommes." },
    { blagues: " Que se fait un Schtroumpf quand il tombe ?", response: "Un Bleu" },
    { blagues: " Quel est le comble pour un marin ?", response: "Avoir le nez qui coule" },
    { blagues: " Qu'est ce que les enfants usent le plus à l'école ?", response: "Le professeur" },
    { blagues: " Quel est le sport le plus silencieux ?", response: "Le para-chuuuut" },
    { blagues: " Quel est le comble pour un joueur de bowling ?", response: "C’est de perdre la boule" }
];

// --- 3. Initialisation de l'Application ---
document.addEventListener('DOMContentLoaded', async function() {
    // Vérifie que tous les éléments essentiels existent avant de les utiliser
    if (!blaguesContainer || !boutonNouvelleBlague || !popupReponse || !contenuReponse || !fermerPopup || 
        !ajouterBlagueBDDButton || !addJokeModal || !closeModalSpan || !addbtn || !newBlagueInput || !newResponseInput) {
        console.error("Un ou plusieurs éléments HTML nécessaires n'ont pas été trouvés. Vérifiez les IDs/classes.");
        if (blaguesContainer) {
            blaguesContainer.innerHTML = '<p>Erreur: L\'application ne peut pas démarrer correctement. Vérifiez la console pour plus de détails.</p>';
        }
        return; 
    }

    await chargerToutesLesBlagues(); // Charge les blagues au démarrage (DB + statiques)
    afficherBlagueAleatoire();        // Affiche une première blague
    
    // Ajout des écouteurs d'événements
    boutonNouvelleBlague.addEventListener('click', afficherBlagueAleatoire);
    fermerPopup.addEventListener('click', fermerLaPopup);
    addbtn.onclick = handleAddJoke; 

    // Écouteurs d'événements pour la MODALE
    ajouterBlagueBDDButton.addEventListener('click', openAddJokeModal); // Ouvre la modale
    closeModalSpan.addEventListener('click', closeAddJokeModal);     // Ferme avec la croix
    addJokeModal.addEventListener('click', (event) => {              // Ferme en cliquant en dehors
        if (event.target === addJokeModal) {
            closeAddJokeModal();
        }
    });
});

// --- 4. Fonctions de Gestion des Blagues (inchangées par rapport à la version précédente) ---

async function chargerToutesLesBlagues() {
    toutesLesBlagues = [...blaguesStatiques];
    try {
        const response = await fetch('http://localhost:5000/getAll');
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur HTTP: ${response.status} - ${errorText || 'Réponse du serveur non lisible.'}`);
        }
        const data = await response.json();
        if (data && Array.isArray(data.data) && data.data.length > 0) {
            toutesLesBlagues = toutesLesBlagues.concat(data.data);
            console.log(`Blagues chargées depuis la DB : ${data.data.length}`);
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

    const blagueDiv = document.createElement('div');
    blagueDiv.classList.add('blague-container'); 

    const questionElement = document.createElement('p');
    questionElement.textContent = blagueAffichee.blagues; 

    const imageElement = document.createElement('img');
    imageElement.src = imageReponseSrc;
    imageElement.classList.add('reponse-image'); 

    imageElement.addEventListener('click', function() {
        afficherReponse(blagueAffichee.response); 
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

// --- 5. Logique d'Ajout de Blague (appelée par handleAddJoke) ---
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
            closeAddJokeModal(); // Ferme la modale après l'ajout réussi

            const nouvelleBlagueObj = {
                id: result.data.id || null, 
                blagues: blagueValue,
                response: responseValue,
                date_création: new Date().toISOString() 
            };
            toutesLesBlagues.push(nouvelleBlagueObj);
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

// --- NOUVELLES FONCTIONS DE GESTION DE LA MODALE ---

/**
 * Ouvre la modale d'ajout de blague.
 */
function openAddJokeModal() {
    addJokeModal.style.display = 'flex'; // Change à 'flex' pour centrer avec CSS
}

/**
 * Ferme la modale d'ajout de blague.
 */
function closeAddJokeModal() {
    addJokeModal.style.display = 'none'; // Cache la modale
}