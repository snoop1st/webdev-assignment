// favoritesDao.js

// Simulated database
const favoritesDatabase = [];

// DAO method to add to favorites
function addToFavorites(advertisementId, title, description, cost, imageUrl, uuid, username) {
  const isDuplicate = favoritesDatabase.some(entry => {
    console.log('Stored ID:', entry.advertisementId);
    console.log('Incoming ID:', advertisementId);
    return entry.advertisementId === advertisementId;
  });
  
  if (!isDuplicate) {
    favoritesDatabase.push({
      advertisementId,
      title,
      description,
      cost,
      imageUrl,
      uuid,
      username,
    });

    console.log('Added to favorites successfully!');
    return true; // Return true for success
  } else {
    console.error('Advertisement is already in favorites.');
    return false; // Return false for failure
  }
}

// Other DAO methods...

// Export the DAO methods
module.exports = {
  addToFavorites,
  // Add other DAO methods...
};
