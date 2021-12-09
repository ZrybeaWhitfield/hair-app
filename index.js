// Load Node modules
const express = require('express');
const ejs = require('ejs');
const cors = require('cors')
const PORT = process.env.PORT || 3000
// Initialise Express
const app = express();
// const { MongoClient } = require("mongodb");
// Render static files
app.use(express.json())
app.use(express.static('public'))
// Set the view engine to ejs
app.set('view engine', 'ejs');


app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
})

// *** GET Routes - display pages ***
// Root Route
app.get('/', function (req, res) {
    res.render('index.ejs');

});

app.get('/login', function(req, res) {
    res.render('rgtr.ejs');
});

app.post("/",(req, res) => {});

app.put("/", (req, res) => {});

app.delete("/", (req, res) => {});





//ROUTES
app.get('/signUpQuiz', (req, res) =>{
  res.render('signUpQuiz.ejs')
})
