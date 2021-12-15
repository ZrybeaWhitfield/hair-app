// Load Node modules
const express = require("express");
const ejs = require("ejs");
const cors = require("cors");
const multer = require('multer');
// const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

//multer stuff
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + ".png")
  }
});
var upload = multer({storage: storage});

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

    await app.post('/createPost', upload.single('postImage'), (req, res) => {
        console.log(req.body)

      db.collection('posts').save({
        picture: "img/" + req.oidc.user.picture,
        name: req.oidc.user.name,
        logTime: req.oidc.user.updated_at
        }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/feed')
      })
    })
    app.put('/updatePost', (req, res) => {
      db.collection('posts').findOneAndUpdate({
        picture: req.oidc.user.picture,
        name: req.oidc.user.name,
        user: req.user._id,
        },{ $set:{ name: req.body.name } },{ sort:{_id: -1} }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database');
        res.redirect('/feed');
      })
    })

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

// app.get("/login", requiresAuth(), (req, res) =>{
//
//   res.render("/profile")
// })

// app.get('/login', (req, res) => {
//   console.log(`${req.oidc.user.name} has logged in`);
//   res.oidc.login({ returnTo: '/profile' })
// })

// app.put("/", (req, res) => {});
//
// app.delete("/", (req, res) => {});

app.get('/profile', function(req, res) {
  db.collection('userData').find( {email: req.oidc.user.email}).toArray((err, userResult) => {

    if(err) return console.log(err);
    console.log(userResult)
    res.render('profile.ejs', {
      nickname : userResult[0].nickname,
      name : userResult[0].name,
      picture: userResult[0].picture,
      email: userResult[0].email,
      userId: userResult[0]._id,
      hairType: userResult[0].hairType,
      hairDensity: userResult[0].hairDensity,
      hairPorosity: userResult[0].hairPorosity,
      hairLength: userResult[0].hairLength,
      hairGoals: userResult[0].hairGoals
      // posts: result
    }
    )
  })

  

});

app.get('/feed', function(req, res) {
  db.collection('posts').find().toArray((err, userResult) => {
    db.collection('comments').find().toArray((error, rslt) => {
      if (err) return console.log(err)
      res.render('feed.ejs', {
        name : userResult.name,
        posts: userResult,
        comment: rslt
      })
    })
  })
});

// app.get('/feed', function(req, res) {
  

//   res.render('feed.ejs')


// });



