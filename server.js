const express = require('express');
const session = require('express-session');
const app = express();
const router = express.Router();
const path = require('path');
const hbs = require('hbs');
const port = 3000;
const collection = require('./src/mongo.js');

// Session middleware configuration
app.use(session({
  secret: 'your_secret_key', // Replace with your own secret key for session encryption
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true if using HTTPS
}));

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "templates"));



app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard'); // Redirect to dashboard if user is logged in
  } else {
    res.render('home'); // Render home page if user is not logged in
  }
});

app.get('/login', (req, res) => {
    res.render('login')
    // res.sendFile('templates/login.hbs',{root:__dirname})

})
app.post('/loginform', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await collection.findOne({ email });

    if (user && user.password === password) {
      req.session.user = user; // Create a session for the authenticated user
      res.redirect('/dashboard');
    } else {
      res.status(401).render("login", { message: 'Incorrect email or password. Please try again.' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({ message: 'An error occurred. Please try again later.' });
  }
});





app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signupform', async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };

  try {
    const existingUser = await collection.findOne({ email : req.body.email });
    if (existingUser) {
      res.status(409).render("signup", { message: 'User details already exist' });
    } else {
      await collection.insertMany([data]);
    }
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }

//   res.status(201).render("dashboard", {
//     naming: req.body.name
// })
res.status(201).redirect("/dashboard")
});


app.get('/dashboard', (req, res) => {
  if (req.session.user) {
    res.render('dashboard', { naming: req.session.user.name });
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});


app.listen(port, () => {
    console.log(`Server listening on port ${port} at http://localhost:${port}`)
  }) 