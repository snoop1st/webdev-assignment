// favoritesDao.js
// Simulated database
const favoritesDatabase = [];

// DAO method to add to favorites
function addToFavorites(advertisementId, title, description, cost, imageUrl, uuid, username) {
  const isDuplicate = favoritesDatabase.some(entry => entry.advertisementId === advertisementId && entry.uuid === uuid);
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
    //console.log('Added to favorites successfully!');  // Log for testing purposes
    //console.log('Updated favoritesDatabase:', favoritesDatabase); // Log the database
    return true;
  } else {
    console.error('Advertisement is already in favorites for this user.');
    //console.log('FavoritesDatabase:', favoritesDatabase); // Log the database
    return false; 
  }
}

function getFavoritesByUUID(uuid) {
  return favoritesDatabase.filter(entry => entry.uuid === uuid);
}

// Export the DAO methods
module.exports = {
  addToFavorites,
  getFavoritesByUUID,
};
