// public/index.js

document.addEventListener('DOMContentLoaded', function() {
    // Charger toutes les blagues au chargement de la page (pour la table, si vous l'utilisez)
    fetch('http://localhost:5000/getAll') // Utilisez le port de votre serveur Express
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
        .catch(error => console.error('Erreur lors du chargement des blagues:', error));

    // Initialiser les blagues aléatoires (si vous voulez qu'elles s'affichent au chargement)
    afficherBlagueAleatoireAvecReponse();
});

// --- LOGIQUE D'AJOUT DE BLAGUE ---
const addbtn = document.querySelector('#ajout-btn');

addbtn.onclick = async function() { // Rendre la fonction asynchrone pour utiliser await
    const newBlagueInput = document.querySelector('#NewBlague');
    const newResponseInput = document.querySelector('#NewResponse');

    const blagueValue = newBlagueInput.value.trim();
    const responseValue = newResponseInput.value.trim();

    if (blagueValue === '' || responseValue === '') {
        alert('Veuillez remplir les deux champs : Blague et Réponse.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/insert', { // Utilisez le port de votre serveur Express
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ // Envoyez les données au format JSON
                blague: blagueValue,
                response: responseValue
            })
        });

        const result = await response.json(); // Analysez la réponse du serveur

        if (result.success) {
            alert('Blague ajoutée avec succès !');
            // Réinitialiser les champs après la soumission réussie
            newBlagueInput.value = '';
            newResponseInput.value = '';
            // Optionnel : Recharger la liste des blagues si elle est affichée
            // fetch('http://localhost:5000/getAll').then(...);
        } else {
            alert('Erreur lors de l\'ajout de la blague : ' + (result.message || 'Erreur inconnue.'));
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi des données :', error);
        alert('Une erreur est survenue lors de la communication avec le serveur.');
    }
};

// --- FONCTION POUR CHARGER LA TABLE HTML (si vous l'utilisez) ---
function loadHTMLTable(data) {
  const table = document.querySelector('table tbody'); // Votre HTML a un <table> mais pas de <thead> ou <tbody> clair pour les données
                                                    // Vous devriez ajuster votre HTML si vous voulez vraiment afficher une table.
  if (data.length === 0){
    // Assurez-vous que l'élément 'table' existe ou ciblez 'blaguesContainer'
    // Cet affichage est pour un <tbody> de table, mais votre HTML n'affiche pas une table de blagues
    console.log("Aucune donnée de blague à afficher ou l'élément de table est incorrect.");
    // table.innerHTML = "<tr><td class='no-data' colspan='5'> Aucune donnée </td></tr>";
  } else {
      // Si vous voulez afficher les blagues de la DB dans blaguesContainer, vous devriez itérer sur 'data'
      // et créer des éléments HTML pour chaque blague, comme vous le faites pour les blagues statiques.
      // Par exemple:
      /*
      data.forEach(blague => {
          const blagueDiv = document.createElement('div');
          blagueDiv.classList.add('blague-item-from-db');
          blagueDiv.innerHTML = `<p>Question: ${blague.blagues}</p><p>Réponse: ${blague.response}</p>`;
          blaguesContainer.appendChild(blagueDiv);
      });
      */
  }
}

// --- SCRIPT TEST (Vos blagues statiques Carambar) ---
// Note : Cette section est indépendante de votre base de données.
// Si vous voulez utiliser la DB pour ces blagues, vous devrez les insérer.
const blaguesQuestionReponse = [
    { question: "1 Quelle est la femelle du hamster ?", reponse: "L’Amsterdam" },
    { question: "2 Que dit un oignon quand il se cogne ?", reponse: "Aïe" },
    { question: "3 Quel est l'animal le plus heureux ?", reponse: "Le hibou, parce que sa femme est chouette." },
    { question: "4 Pourquoi le football c'est rigolo ?", reponse: "Parce que Thierry en rit" },
    { question: "5 Quel est le sport le plus fruité ?", reponse: "La boxe, parce que tu te prends des pêches dans la poire et tu tombes dans les pommes." },
    { question: "6 Que se fait un Schtroumpf quand il tombe ?", reponse: "Un Bleu" },
    { question: "7 Quel est le comble pour un marin ?", reponse: "Avoir le nez qui coule" },
    { question: "8 Qu'est ce que les enfants usent le plus à l'école ?", reponse: "Le professeur" },
    { question: "9 Quel est le sport le plus silencieux ?", reponse: "Le para-chuuuut" },
    { question: "10 Quel est le comble pour un joueur de bowling ?", reponse: "C’est de perdre la boule" }
];

const blaguesContainer = document.getElementById('blaguesContainer');
const boutonNouvelleBlague = document.getElementById('boutonNouvelleBlague');
const popupReponse = document.getElementById('popupReponse');
const contenuReponse = document.getElementById('contenuReponse');
const fermerPopup = document.getElementById('fermerPopup');
const imageReponseSrc = './assete/img/response.png'; 

function afficherBlagueAleatoireAvecReponse() {
    blaguesContainer.innerHTML = ''; // Efface le contenu précédent
    const indexAleatoire = Math.floor(Math.random() * blaguesQuestionReponse.length);
    const blagueAleatoire = blaguesQuestionReponse[indexAleatoire];

    const blagueDiv = document.createElement('div');
    blagueDiv.classList.add('blague-container');

    const questionElement = document.createElement('p');
    questionElement.textContent = blagueAleatoire.question;

    const imageElement = document.createElement('img');
    imageElement.src = imageReponseSrc;
    imageElement.classList.add('reponse-image');
    imageElement.addEventListener('click', function() {
        afficherReponse(blagueAleatoire.reponse);
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

// Vérifier que tous les éléments sont présents avant d'ajouter les écouteurs d'événements
if (boutonNouvelleBlague && blaguesContainer && popupReponse && contenuReponse && fermerPopup) {
    boutonNouvelleBlague.addEventListener('click', afficherBlagueAleatoireAvecReponse);
    fermerPopup.addEventListener('click', fermerLaPopup);
    // Supprimé l'appel initial ici, car il est dans DOMContentLoaded
} else {
    console.error("Un ou plusieurs éléments HTML nécessaires pour les blagues Carambar n'ont pas été trouvés.");
}