// Load Node modules
const express = require("express");
const ejs = require("ejs");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const { MongoClient } = require("mongodb");
// const dotenv = require("dotenv");
// dotenv.config();

// Initialise Express
const app = express();
app.use(express.urlencoded({ extended: true }));
// Render static files
app.use(express.json());
app.use(express.static("public"));
// Set the view engine to ejs
app.set("view engine", "ejs");

const MongoDB_URL = `mongodb+srv://zedlee:Egbdf080710@cluster1.srhmk.mongodb.net/hair-app?retryWrites=true&w=majority`;
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
    app.get("/", function (req, res) {
      res.render("index.ejs");
    });

    app.get("/login", function (req, res) {
      res.render("rgtr.ejs");
    });

    app.get("/signUpQuiz", (req, res) => {
      res.render("signUpQuiz.ejs");
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
