const express = require('express');
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3300

app.use(express.json())
app.use(express.static('public'))
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
})

//ROUTES
app.get('/', (req, res) =>{
  res.render('signUpQuiz.ejs')
})
