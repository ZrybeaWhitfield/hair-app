// Load Node modules
const express = require('express');
const ejs = require('ejs');
// Initialise Express
const app = express();
// const { MongoClient } = require("mongodb");
// Render static files
app.use(express.static('public'));
// Set the view engine to ejs
app.set('view engine', 'ejs');


// *** GET Routes - display pages ***
// Root Route
app.get('/', function (req, res) {
    res.render('index.ejs');
    
});

app.get('/Login', function(req, res) {
    res.render('rgtr.ejs');
});
  
app.post("/",(req, res) => {});

app.put("/", (req, res) => {});

app.delete("/", (req, res) => {});

// Port website will run on
let PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Server listening on {PORT}`);
});