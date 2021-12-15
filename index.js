// Load Node modules
const express = require("express");
const ejs = require("ejs");
const cors = require("cors");
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' })
// const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

// auth0 initial
const { auth,requiresAuth } = require('express-openid-connect');
// Initialise Express
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(
  auth({
    authRequired:false,
    auth0Logout:true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env. CLIENT_ID,
    secret: process.env.SECRET,
    idpLogout: true
  })
);
// Render static files
app.use(express.json());
app.use(express.static("public"));
// Set the view engine to ejs
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});


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
    await app.post("/userData", (req, res) => {

      // obtain the user data from the auth0
      const userName = req.oidc.user.nickname
      const name = req.oidc.user.name;
      const email = req.oidc.user.email;
      const picture = req.oidc.user.picture;
      const logTime = req.oidc.user.updated_at;
      // collection the data from the signUpQuiz
      let hairType = req.body.hairType;
      let hairDensity = req.body.hairDensity;
      let hairPorosity = req.body.hairPorosity;
      let hairLength = req.body.hairLength;
      let hairGoals = req.body.hairGoals;

      let userData = {userName, name, email, picture,logTime, hairType, hairDensity, hairPorosity, hairLength, hairGoals};

      db.collection("userData").insertOne(userData);
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

app.get("/", function (req, res) {
  res.render("index.ejs");
});

app.get("/signUpQuiz", requiresAuth(), async (req, res) => {
  console.log(req.oidc.user);
  //check to findOne req.oidc.email => if it exists redirect to profile else render quiz
  const user = await db.collection('userData').findOne( {email: req.oidc.user.email})

  if(user){
    return res.redirect('/profile')
  }

  res.render("signUpQuiz.ejs");
});


// app.put("/", (req, res) => {});
//
// app.delete("/", (req, res) => {});
