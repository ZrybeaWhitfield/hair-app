// Load Node modules
const express = require("express");
const ejs = require("ejs");
const cors = require("cors");
// const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();


// Initialise Express
const app = express();
app.use(express.urlencoded({ extended: true }));
// Render static files
app.use(express.json());
app.use(express.static("public"));
// Set the view engine to ejs
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

// auth0 initial
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

// mongoDB initial
const url = process.env.MONGO_URI

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })
const dbName = "hair-app";
const db = client.db(dbName);


// start routes
async function main(){

  try{
    await client.connect();

    // *** Post Routes ***
    await app.post("/login", (req, res) => {
      const name = req.body.name;
      const emailNew = req.body.emailNew;
      const passwordNew = req.body.passwordNew;
      const passwordComfrim = req.body.passwordComfirm;
      const Data = {name,emailNew,passwordNew,passwordComfrim};

      db.collection("signData").insertOne(Data);
      res.redirect("/signUpQuiz")
    });
    await app.post("/userPreferences", (req, res) => {
      let hairType = req.body.hairType;
      let hairDensity = req.body.hairDensity;
      let hairPorosity = req.body.hairPorosity;
      let hairLength = req.body.hairLength;
      let hairGoals = req.body.hairGoals;

      console.log(hairGoals);

      let hairData = {hairType, hairDensity, hairPorosity, hairLength, hairGoals};

      db.collection("hairTypes").insertOne(hairData);
      res.redirect("/profile")
    });

  } catch (error) {
    console.error(error);
  }
}


main()
  .catch(console.error)


//GET REQUESTS
// *** GET Routes - display pages ***
    // Root Route

    // app.get('/', (req, res) => {
    //   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
    // });

    app.get('/profile',requiresAuth(),(req, res) => {
      res.send(JSON.stringify(req.oidc.user))
    })

    app.get("/", function (req, res) {
      res.render("index.ejs");
    });


    app.get("/signUpQuiz", requiresAuth(),(req, res) => {
      res.render("signUpQuiz.ejs");
    });

// app.put("/", (req, res) => {});
//
// app.delete("/", (req, res) => {});
