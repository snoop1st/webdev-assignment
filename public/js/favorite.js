// TODO: Add more details in the favorite ads list
// TODO: Add a button to remove an ad from the favorites list

// Get the user favorites list from localStorage
const userFavoritesList = JSON.parse(localStorage.getItem('userFavoritesList')) || [];

// Function to display user favorites on page load
window.onload = function () {

  // Display user favorites on page load
  function displayUserFavorites() {
    const favoriteAdsList = document.getElementById('favorite-ads-list');

    // Check if the element exists
    if (favoriteAdsList) {
      // Get the username and session ID from the URL parameters
      const urlSearchParams = new URLSearchParams(window.location.search);
      const currentUsername = urlSearchParams.get('username');
      const currentUserUUID = urlSearchParams.get('sessionId');

      if (currentUsername && currentUserUUID) {
        // Filter userFavoritesList based on current user's information
        const filteredFavorites = userFavoritesList.filter(favorite => {
          return favorite.username === currentUsername && favorite.uuid === currentUserUUID;
        });

        // Generate HTML for user favorites
        const favoriteAdsHTML = filteredFavorites.map(favorite => {
          return `<div class="favorite-ad">
                  <h3>${favorite.title}</h3>
                  <p>${favorite.description}</p>
                  <img src="${favorite.imageUrl}" alt="${favorite.title}">
                  <p>Cost: ${favorite.cost}</p>
                  <p>Advertisement ID: ${favorite.advertisementId}</p>
                  <p>Added by: ${favorite.username}</p>
                </div>`;
        });

        // Update the content of the favorite ads list
        favoriteAdsList.innerHTML = favoriteAdsHTML.join('');
      } else {
        console.error('Invalid user session data. Username or session ID missing in the URL.');
        alert('Please provide a valid username and session ID.');
      }
    } else {
      console.error('Favorite ads list element not yet found.');
    }
  }

  // Call the function to display user favorites
  displayUserFavorites();
};

async function toggleFavorite(adId) {
  const storedJsonResponse = localStorage.getItem('jsonResponse');

  if (storedJsonResponse) {
    const jsonResponse = JSON.parse(storedJsonResponse);
    const username = jsonResponse.username;
    const uuid = jsonResponse.uuid;

    if (username && uuid) {
      const article = document.querySelector(`article[data-id="${adId}"]`);

      if (article) {
        const adTitle = article.querySelector('h3').textContent;
        const adDescription = article.querySelector('p:nth-of-type(2)').textContent;
        const adImageUrl = article.querySelector('.carousel-image').src;

        const featuresTable = article.querySelector(`#features-table-${adId} table`);
        let adCost = 'N/A';

        if (featuresTable) {
          const rows = featuresTable.rows;

          for (let i = 0; i < rows.length; i++) {
            const featureName = rows[i].cells[0].textContent;

            if (featureName.toLowerCase() === 'cost') {
              adCost = rows[i].cells[1].textContent;
              break;
            }
          }
        }

        // Check if the ad is already in the userFavoritesList for the specific user
        const isDuplicate = userFavoritesList.some(entry => entry.advertisementId === adId && entry.uuid === uuid);

        if (!isDuplicate) {
          // Push the new favorite to the list
          userFavoritesList.push({
            advertisementId: adId,
            title: adTitle,
            description: adDescription,
            cost: adCost,
            imageUrl: adImageUrl,
            uuid: uuid,
            username: username,
          });

          // Save the updated list to localStorage
          localStorage.setItem('userFavoritesList', JSON.stringify(userFavoritesList));

          // Log the updated list
          //console.log('Updated Favorites List:', userFavoritesList);  // Log for testing purposes

          response = await fetch('http://localhost:3000/addToFavorites', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              advertisementId: adId,
              title: adTitle,
              description: adDescription,
              cost: adCost,
              imageUrl: adImageUrl,
              uuid: uuid,
              username: username,
            }),
          });

          const data = await response.json();

          if (data.success) {
            // Update button text to indicate it's added to favorites
            const button = article.querySelector('button.favorite-button');
            if (button) {
              button.textContent = 'Προστέθηκε στα αγαπημένα!';
              button.disabled = true; // Disable the button
              // Log all the info stored in the userFavoritesList for testing purposes
/*            console.log('User Data:');
              console.log('Username:', username);
              console.log('UUID:', uuid);
              console.log('Advertisement Details:');
              console.log('Advertisement ID:', adId);
              console.log('Title:', adTitle);
              console.log('Description:', adDescription);
              console.log('Cost:', adCost);
              console.log('Image URL:', adImageUrl);
*/
            } else {
              console.error(`Button element not found for ID: ${adId}`);
            }
          } else {
            const button = article.querySelector('button.favorite-button');
            button.textContent = 'Προστέθηκε στα αγαπημένα!';
            button.disabled = true;
            alert('Advertisement is already in favorites.');
            console.error('Failed to add to favorites:', data.error);
          }
        } else {
          const button = article.querySelector('button.favorite-button');
          button.textContent = 'Προστέθηκε στα αγαπημένα!';
          button.disabled = true;
          alert('Advertisement is already in favorites for this user.');
          console.error('Duplicate advertisement in favorites for this user:', adId);
        }
      } else {
        console.error(`Article element not found for ID: ${adId}`);
      }
    } else {
      console.error('Invalid user session data. Login first.');
      alert('Please login first.');
    }
  } else {
    console.error('User session data not available. Login first.');
    alert('Please login first.');
  }
}
