// favoritesDao.js

// Simulated database
const favoritesDatabase = [];

// DAO method to add to favorites
function addToFavorites(advertisementId, title, description, cost, imageUrl, uuid, username) {
  const isDuplicate = favoritesDatabase.some(entry => entry.advertisementId === advertisementId && entry.uuid === uuid);
  console.log('in addtofavorites function1:', uuid);
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
    console.log('Updated favoritesDatabase:', favoritesDatabase); // Log the database
    return true; // Return true for success
  } else {
    console.error('Advertisement is already in favorites for this user.');
    console.log('FavoritesDatabase:', favoritesDatabase); // Log the database
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