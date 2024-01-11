const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const favoritesDao = require('./public/js/favoritesDao');
const userDao = require('./public/js/userDao'); 
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 8080;

app.listen(port);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/addToFavorites', async (req, res) => {
  const { advertisementId, title, description, cost, imageUrl, uuid, username } = req.body;
  const user = userDao.getUserByUsername(username);

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

app.get('/', function (req, res) {
  var options = {
    root: path.join(__dirname, 'public')
  }

  res.sendFile('index.html', options, function (err) {
    console.log(err);
  });
});
