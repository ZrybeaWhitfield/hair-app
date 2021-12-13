// Load Node modules
const express = require("express");
const ejs = require("ejs");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const { MongoClient } = require("mongodb");

const dotenv = require('dotenv');
dotenv.config();

// Initialise Express
const app = express();
app.use(express.urlencoded({ extended: true }));
// Render static files
app.use(express.json());
app.use(express.static("public"));
// Set the view engine to ejs
app.set("view engine", "ejs");

const { auth,requiresAuth } = require('express-openid-connect');

app.use(
  auth({
    authRequired:false,
    auth0Logout:true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env. CLIENT_ID,
    secret: process.env.SECRET,
    idpLogout: true,
  })
);

const MongoDB_URL=process.env.MONGO_URI;
const dbName = "hair-app";

MongoClient.connect(MongoDB_URL, { useUnifiedTopology: true }).then(
  (client) => {
    console.log("Connected to Database");

    const db = client.db(dbName);
    

    app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}`);
    });

    // *** GET Routes - display pages ***
    // Root Route

    // app.get('/', (req, res) => {
    //   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
    // });

    app.get("/", function (req, res) {
      res.render("index.ejs");
    });

    app.get('/login',requiresAuth(),(req, res) => {
      res.render("rgtr.ejs");
    }) 

    app.get('/profile',requiresAuth(),(req, res) => {
      res.send(JSON.stringify(req.oidc.user))
    }) 

    app.get("/", function (req, res) {
      res.render("index.ejs");
    });

    app.get("/signUpQuiz", (req, res) => {
      res.render("signUpQuiz.ejs");
    });

    app.get("/feed", (req, res) => {
      res.render("feed.ejs");
    });

     // *** Post Routes ***
    app.post("/login", (req, res) => {
      const name = req.body.name;
      const emailNew = req.body.emailNew;
      const passwordNew = req.body.passwordNew;
      const passwordComfrim = req.body.passwordComfirm;
      const Data = {name,emailNew,passwordNew,passwordComfrim};

      db.collection("signData").insertOne(Data);
      res.redirect("/signUpQuiz")
    });

    app.put("/", (req, res) => {});

    app.delete("/", (req, res) => {});
  }
);

