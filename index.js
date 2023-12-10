const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

app.listen(port);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve 'category-template.js' with the correct MIME type
app.get('/category-template.js', function(req, res) {
    res.header('Content-Type', 'application/javascript');
    res.sendFile('public/js/category-template.js', { root: __dirname });
});

app.get('/', function(req, res){
    var options = {
        root: path.join(__dirname, 'public')
    }

    res.sendFile('index.html', options, function(err){
        console.log(err);
    });
});
