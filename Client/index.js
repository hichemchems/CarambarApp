// public/index.js

document.addEventListener('DOMContentLoaded', function() {
    // Charger toutes les blagues au chargement de la page (pour la table, si vous l'utilisez)
    fetch('http://localhost:5000/getAll') // Utilisez le port de votre serveur Express
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
        .catch(error => console.error('Erreur lors du chargement des blagues:', error));

   
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
        const response = await fetch('http://localhost:5000/insert', { // Utilisez le port du serveur Express
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


// public/index.js (Partie loadHTMLTable)

function loadHTMLTable(data) {
  const table = document.querySelector('table tbody'); 
  const blaguesContainer = document.getElementById('blaguesContainer'); 

  if (!data || !Array.isArray(data) || data.length === 0){
    console.log("Aucune donnée de blague à afficher ou données incorrectes/vides.");
    if (blaguesContainer) { 
        blaguesContainer.innerHTML = '<p>Aucune blague trouvée ou erreur de chargement.</p>';
    }
    return;
  } 

  
  if (blaguesContainer) {
      blaguesContainer.innerHTML = ''; 
  }

  data.forEach(blague => {
      const blagueDiv = document.createElement('div');
      blagueDiv.classList.add('blague-item-from-db');
      
      
      blagueDiv.innerHTML = `<p>Question: ${blague.blagues}</p><p>Réponse: ${blague.response}</p>`;
      if (blaguesContainer) {
          blaguesContainer.appendChild(blagueDiv);
      }
  });
}

// --- SCRIPT TEST ( blagues statiques Carambar) ---

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