// Simulated local storage for favorites
const favoritesStorage = [];

// Simulated function to add to favorites locally
function simulateAddToFavoritesService(data) {
    // Check for duplicate entries
    const isDuplicate = favoritesStorage.some(entry => entry.advertisementId === data.advertisementId);

    if (!isDuplicate) {
        favoritesStorage.push(data);
        console.log('Added to favorites successfully!');
    } else {
        console.error('Advertisement is already in favorites.');
    }
}


// Function to get user session information (example implementation)
function getUserSession() {
    // Check if jsonResponse is available and has the required properties
    if (jsonResponse && jsonResponse.username && jsonResponse.uuid) {
        return {
            username: jsonResponse.username,
            sessionId: jsonResponse.sessionId,
            uuid: jsonResponse.uuid,
        };
    } else {
        console.error('User session data not available.');
        return null;
    }
}

function toggleFavorite(adId, adTitle, adDescription, adCost, adImageUrl) {
    const jsonResponse = window.jsonResponse; // Retrieve the jsonResponse from the global variable

    // Check if jsonResponse is available and has the required properties
    if (jsonResponse && jsonResponse.username && jsonResponse.uuid) {
        const favoritesStorage = getFavoritesFromLocalStorage(); // Retrieve favorites from local storage
        const isAlreadyFavorite = favoritesStorage.some(entry => entry.advertisementId === adId);

        if (isAlreadyFavorite) {
            console.error('Advertisement is already in favorites.');
            alert('Advertisement is already in favorites.');
        } else {
            fetch('https://jsonplaceholder.typicode.com/posts', {
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
                    uuid: jsonResponse.uuid, // Use the uuid from the jsonResponse
                    username: jsonResponse.username, // Use the username from the jsonResponse
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);

                // Update button text to indicate it's added to favorites
                const button = document.querySelector(`article[data-id="${adId}"] button.favorite-button`);

                if (button) {
                    button.textContent = 'Προστέθηκε στα αγαπημένα!';
                    button.disabled = true; // Optionally disable the button after adding to favorites
                } else {
                    console.error(`Button element not found for ID: ${adId}`);
                }

                // Add to favorites locally
                simulateAddToFavoritesService({
                    advertisementId: adId,
                    title: adTitle,
                    description: adDescription,
                    cost: adCost,
                    imageUrl: adImageUrl,
                    uuid: jsonResponse.uuid,
                    username: jsonResponse.username,
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    } else {
        // User is not logged in, display an alert
        console.error('User session data not available. Login first.');
        alert('Dear user please login first.');
    }
}


// Simulated function to get favorites from local storage
function getFavoritesFromLocalStorage() {
    // Retrieve favorites from local storage or use an empty array if not found
    const favoritesJson = localStorage.getItem('favorites');
    return favoritesJson ? JSON.parse(favoritesJson) : [];
}

function getAdvertisementDetails(advertisementId) {
    // Retrieve the HTML elements for the current advertisement
    const articleElement = document.querySelector(`article[data-id="${advertisementId}"]`);
    
    // Check if the article element is found
    if (articleElement) {
        // Extract text content from the elements
        const titleElement = articleElement.querySelector('h3');
        const descriptionElement = articleElement.querySelector('p:nth-of-type(2)');

        if (titleElement && descriptionElement) {
            const title = titleElement.textContent.trim();
            const description = descriptionElement.textContent.trim();

            // Return the advertisement details
            return {
                title,
                description,
                // Add more details as needed
            };
        } else {
            console.error(`Title or description element not found for ID: ${advertisementId}`);
            return null;
        }
    } else {
        console.error(`Article element not found for ID: ${advertisementId}`);
        return null;
    }
}


