function toggleFavorite(adId) {
    const storedJsonResponse = localStorage.getItem('jsonResponse');

    if (storedJsonResponse) {
        const jsonResponse = JSON.parse(storedJsonResponse);
        const username = jsonResponse.username;
        const uuid = jsonResponse.uuid;

        const article = document.querySelector(`article[data-id="${adId}"]`);

        if (article) {
            const adTitle = article.querySelector('h3').textContent;
            const adDescription = article.querySelector('p:nth-of-type(2)').textContent;
            const adImageUrl = article.querySelector('.carousel-image').src;

            // Dynamically retrieve cost from the features table
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

            console.log('User Data:');
            console.log('Username:', username);
            console.log('UUID:', uuid);

            console.log('Advertisement Details:');
            console.log('Advertisement ID:', adId);
            console.log('Title:', adTitle);
            console.log('Description:', adDescription);
            console.log('Cost:', adCost);
            console.log('Image URL:', adImageUrl);

            fetch('http://localhost:3000/addToFavorites', {
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
            })
            .then(response => response.json())
            .then(data => {
                // Update button text to indicate it's added to favorites
                const button = article.querySelector('button.favorite-button');

                if (button) {
                    button.textContent = 'Προστέθηκε στα αγαπημένα!';
                    button.disabled = true; // Optionally disable the button after adding to favorites
                } else {
                    console.error(`Button element not found for ID: ${adId}`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            console.error(`Article element not found for ID: ${adId}`);
        }
    } else {
        console.error('User session data not available. Login first.');
        alert('Dear user, please login first.');
    }
}
