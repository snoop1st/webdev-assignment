// favoritesDao.js

// Simulated database
const favoritesDatabase = [];

// DAO method to add to favorites
function addToFavorites(advertisementId, title, description, cost, imageUrl, uuid, username) {
  const isDuplicate = favoritesDatabase.some(entry => entry.advertisementId === advertisementId);

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

// DAO method to get favorites by user UUID
function getFavoritesByUUID(uuid) {
  return favoritesDatabase.filter(entry => entry.uuid === uuid);
}

// Other DAO methods...

// Export the DAO methods
module.exports = {
  addToFavorites,
  getFavoritesByUUID,
  // Add other DAO methods...
};
