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


// Davida's input 
    // QP Posts routes ===============================================================
  app.post('/createPost', upload.single('file-to-upload'), (req, res) => {
    db.collection('posts').save({
      image: "img/" + req.file.filename,
      caption: req.body.caption,
      user: req.user._id,
      likes: 0,
      timestamp: req.body.timestamp
      }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/feed')
    })
  })
  app.put('/updatePost', (req, res) => {
    db.collection('posts').findOneAndUpdate({
      image: req.body.image,
      caption: req.body.caption,
      user: req.user._id,
      likes: 0
      },{ $set:{ caption: req.body.newCaption } },{ sort:{_id: -1} }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database');
      res.redirect('/feed');
    })
  })

  app.delete('/delPost', (req, res) => {
    db.collection('posts').findOneAndDelete({
      _id: ObjectId(req.body.id)
      }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  //USER'S POSTS
  app.get('/profile', isLoggedIn, function(req, res) {
      db.collection('posts').find().toArray((err, result) => {
          for(post in result) {
              if(post.id != ObjectId(req.user.id))
                  delete result.post
          }
        if (err) return console.log(err)
        res.render('profile.ejs', {
          user : req.user,
          posts: result
        })
      })
  });
  // COMMENTS SECTION

  app.get('/comment', isLoggedIn, function(req, res) {
      db.collection('comments').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('post.ejs', {
          user : req.user,
          comments: result
      })
      })
  });

  app.post('/createComment', (req, res) => {
      const comingFromPage = req.headers['referer'].slice(req.headers['origin'].length);
      db.collection('comments').insertOne({
          comment: req.body.comment, 
          poster: req.user._id, 
          post: req.body.postId,
          timestamp: req.body.timestamp
      }, (err, result) => {
          if (err) return res.send(err);
          console.log('Comment Created');
          res.redirect(comingFromPage);
      })
  })
  app.delete('/delComment', (req, res) => {
      db.collection('comments').findOneAndDelete({
        comment: req.body.comment,
        poster: req.user._id,
        post: req.body.postId
        }, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })