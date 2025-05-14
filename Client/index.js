document.addEventListener('DOMContentLoaded', function(){
      fetch ('http://localhost:5000/getAll')
      .then(response => response.json())
      .then( data => loadHTMLTable(data['data']));
      
});

const addbtn = document.querySelector('#ajout-btn');

addbtn.onclick = function (){
  const blagues = document.querySelector('#NewBlague')
}


function loadHTMLTable(data) {
  const table = document.querySelector('table tbody');
  
  

  if (data.length === 0){
    table.innerHTML = "<tr><td classe ='no-data' colspan = '5'> No Data </td></tr>";

  }

}





//script test 

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
            blaguesContainer.innerHTML = '';
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

        if (boutonNouvelleBlague && blaguesContainer && popupReponse && contenuReponse && fermerPopup) {
            boutonNouvelleBlague.addEventListener('click', afficherBlagueAleatoireAvecReponse);
            fermerPopup.addEventListener('click', fermerLaPopup);
            afficherBlagueAleatoireAvecReponse();
        } else {
            console.error("Un ou plusieurs éléments HTML nécessaires n'ont pas été trouvés.");
        }