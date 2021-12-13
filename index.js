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



const url = process.env.MONGO_URI

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })
const dbName = "hair-app";
const db = client.db(dbName);


async function main(){

  try{
    await client.connect()

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

  } catch (error) {
    console.error(error);
  }
}


main()
  .catch(console.error)

const newHairType = {
  typeOne: "Straight"
}
async function createHairType(client, newHairType){
  const result = await client.db(dbName).collection('hairTypes').insertOne(newHairType)
}

//GET REQUESTS

app.get("/", function (req, res) {
  res.render("index.ejs");
});

app.get("/login", function (req, res) {
  res.render("rgtr.ejs");
});

app.get("/signUpQuiz", (req, res) => {
  res.render("signUpQuiz.ejs");
});


// app.put("/", (req, res) => {});
//
// app.delete("/", (req, res) => {});
