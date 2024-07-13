const express = require('express')
const app = express()
const router = express.Router()
const path = require('path')
const hbs = require('hbs')
const port = 3000
const collection = require('./src/mongo.js')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))//imp
app.use(express.static('public'));

app.set("view engine","hbs")
app.set("views", path.join(__dirname,"templates"))


app.get('/', (req, res) => {
  res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
    // res.sendFile('templates/login.hbs',{root:__dirname})

})
app.post('/loginform', async (req, res) => {
  try{
    const check = await collection.findOne({email:req.body.email})

    if(check.password === req.body.password){
      res.render("dashboard", { naming:`${check.name}`})
    }
    else{
      res.send('Wrong password')
    }
  }
  catch(err){
    console.log(err)
    res.send("Wrong details")
  }
})

app.get('/signup', (req, res) => {
  res.sendFile('templates/signup.hbs',{root:__dirname})
})
app.post('/signupform', async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };

  try {
    // Assuming 'collection' is correctly implemented to interact with MongoDB
    const existingUser = await collection.findOne({ email: req.body.email });

    if (existingUser) {
      res.send("User details already exist");
    } else {
      await collection.insertMany([data]);
    }
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Internal Server Error');
  }

  res.status(201).render("dashboard", {
    naming: req.body.name
})
});



app.listen(port, () => {
    console.log(`Server listening on port ${port} at http://localhost:${port}`)
  }) 