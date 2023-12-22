const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const favoritesDao = require('./public/js/favoritesDao');
const userDao = require('./public/js/userDao'); // Replace with your actual path
const { v4: uuidv4 } = require('uuid'); // Import uuidv4 from the 'uuid' library
const app = express();
const port = 8080;

app.listen(port);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve 'category-template.js' with the correct MIME type
app.get('/category-template.js', function (req, res) {
  res.header('Content-Type', 'application/javascript');
  res.sendFile('public/js/category-template.js', { root: __dirname });
});
app.get('/getFavorites', (req, res) => {
  const uuid = req.query.uuid;
  const userFavorites = favoritesDao.getFavoritesByUUID(uuid);
  res.json({ favorites: userFavorites });
});
// Define your addToFavorites route
app.post('/addToFavorites', async (req, res) => {
  const { advertisementId, title, description, cost, imageUrl, uuid, username } = req.body;
  const user = await userDao.getUserByUsername(username);

  if (!user) {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
    return;
  }
  const result = favoritesDao.addToFavorites(advertisementId, title, description, cost, imageUrl, uuid, username);

  if (result) {
    res.status(200).json({ success: true, message: 'Added to favorites successfully!' });
  } else {
    res.status(400).json({ success: false, error: 'Advertisement is already in favorites.' });
  }
});
// Define your login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Authenticate the user
  const authenticationResult = authenticateUser(username, password);

  if (authenticationResult.statusCode === 200) {
    // Check if the user already has a session UUID cookie
    let userUuid = getSessionCookie(username);

    if (!userUuid) {
      // If not, generate a new UUID and set the cookie
      userUuid = uuidv4();
      setSessionCookie(username, userUuid);
    }

    // Send the response with the generated session ID
    res.json({
      sessionId: authenticationResult.body.sessionId,
      userUuid: userUuid,
    });
  } else {
    // Handle authentication failure
    res.status(authenticationResult.statusCode).json({
      error: authenticationResult.body.error,
    });
  }
});


app.get('/', function (req, res) {
  var options = {
    root: path.join(__dirname, 'public')
  }

  res.sendFile('index.html', options, function (err) {
    console.log(err);
  });
});
