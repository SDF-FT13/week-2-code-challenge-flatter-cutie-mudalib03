// Your code here
let allCharacters = [];
let currentCharacter = null;

document.addEventListener('DOMContentLoaded', () => {
  const characterBar = document.getElementById('character-bar');
  const detailedInfo = document.getElementById('detailed-info');
  const nameEl = document.getElementById('name');
  const imageEl = document.getElementById('image');
  const voteCountEl = document.getElementById('vote-count');
  const votesForm = document.getElementById('votes-form');
  const resetBtn = document.getElementById('reset-btn');

  fetchCharacters();

  votesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const votesInput = document.getElementById('votes');
    const votes = parseInt(votesInput.value);

    if (!currentCharacter) {
      alert('No character selected!');
      return;
    }

    if (isNaN(votes) || votes < 0) {
      alert('Please enter a valid positive number.');
      return;
    }

    currentCharacter.votes += votes;
    voteCountEl.textContent = currentCharacter.votes;
    votesForm.reset();
  });

  resetBtn.addEventListener('click', () => {
    if (currentCharacter) {
      currentCharacter.votes = 0;
      voteCountEl.textContent = '0';
    }
  });

  function fetchCharacters() {
    fetch('http://localhost:3000/characters')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch characters.');
        }
        return response.json();
      })
      .then(characters => {
        allCharacters = characters;
        displayCharacters(characters);
      })
      .catch(error => {
        console.error('Error fetching characters:', error);
        alert('Failed to load characters. Please try again later.');
      });
  }

  function displayCharacters(characters) {
    characterBar.innerHTML = '';

    characters.forEach(character => {
      const span = document.createElement('span');
      span.textContent = character.name || 'Unnamed Character';
      span.dataset.id = character.id;

      span.addEventListener('click', () => {
        displayCharacterDetails(character);
      });

      characterBar.appendChild(span);
    });
  }

  function displayCharacterDetails(character) {
    currentCharacter = character;
    character.votes = character.votes || 0;

    nameEl.textContent = character.name;
    const imageUrl = character.image ? character.image : 'default-image-url.jpg';

    console.log(`Displaying image for ${character.name}: ${imageUrl}`);
    if (!character.image) {
      console.warn(`Image URL missing for ${character.name}, using default image.`);
    }

    imageEl.src = imageUrl;
    imageEl.alt = character.name;
    voteCountEl.textContent = character.votes;
  }
});
