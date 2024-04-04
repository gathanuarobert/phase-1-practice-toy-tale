let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById('toy-collection');
  const toyForm = document.querySelector('.add-toy-form');

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  function fetchToys() {
    fetch('http://localhost:3000/toys')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            data.forEach(toy => {
                // Create card for each toy
                const card = createToyCard(toy);
                toyCollection.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching toys:', error);
        });
}

// Create card for toy
function createToyCard(toy) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h2>${toy.name}</h2>
        <img src="${toy.image}" class="toy-avatar">
        <p>${toy.likes} Likes</p>
        <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
    `;
    
    // Add event listener for like button
    const likeButton = card.querySelector('.like-btn');
    likeButton.addEventListener('click', handleLike);

    return card;
}

// Handle like button click
function handleLike(event) {
    const toyId = event.target.dataset.id;
    const likesElement = event.target.parentElement.querySelector('p');
    let currentLikes = parseInt(likesElement.textContent);

    // Increment likes count locally
    currentLikes++;

    // Update likes count in the server
    fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            likes: currentLikes
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Update likes count in the DOM
        likesElement.textContent = `${data.likes} Likes`;
    })
    .catch(error => {
        console.error('Error liking toy:', error);
    });
}

// Handle toy form submission
toyForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const image = formData.get('image');

    // Add new toy to the server
    fetch('http://localhost:3000/toys', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            name: name,
            image: image,
            likes: 0
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Create card for the new toy and add it to the DOM
        const card = createToyCard(data);
        toyCollection.appendChild(card);

        // Clear form fields
        toyForm.reset();
    })
    .catch(error => {
        console.error('Error adding toy:', error);
    });
});

// Fetch and display toys
fetchToys();
  
})

