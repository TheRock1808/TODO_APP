const express = require('express');
const path = require('path');
const ejs = require('ejs');
const Todo = require('./models/Todo');
const collection = require('./models/mongo.js');

const session = require('express-session');

const port = 3000;
const app = express();

app.use(session({
    secret: 'SecretTodo',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard'); // Redirect to dashboard if user is logged in
    } else {
        res.render('home.ejs'); // Render home page if user is not logged in
    }
});

app.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.render('login', { message: "" });
    }

});

app.post('/loginform', async (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {

        try {
            const { email, password } = req.body;
            const user = await collection.findOne({ email });

            if (user && user.password === password) {
                req.session.user = user;
                // Create a session for the authenticated user
                res.redirect('/dashboard');
            } else {
                res.status(401).render("login", { message: 'Incorrect email or password. Please try again.' });
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).send({ message: 'An error occurred. Please try again later.' });
        }
    }
});

// app.get('/dashboard', (req, res) => {
//   if (req.session.user) {
//     res.render('dashboard', { naming: req.session.user.name });
//   } else {
//     res.redirect('/login');
//   }
// });

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/');
    });
});

app.get('/signup', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.render('signup', { message: "" });
    }
});

app.post('/signupform', async (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {

        const data = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        };

        try {
            const existingUser = await collection.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(409).render("signup", { message: 'User details already exist' });
            } else {
                await collection.insertMany([data]);

                req.session.user = data; // Store user data in the session
                res.redirect('/dashboard');
            }
        } catch (error) {
            console.error('Error inserting data:', error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
});

app.get("/dashboard", async (req, res) => {
    if (req.session.user) {
        const todos = await Todo.find({ email: req.session.user.email });
        res.render("index.ejs", { todos });
    } else {
        res.render('login', { message: "" });
    }

});

app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find({ email: req.session.user.email });
        res.render('todos.ejs', { todos });
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/todo/new', (req, res) => {
    res.render('new');
});

app.post("/todo", async (req, res) => {
    try {
        req.body.complete = false;
        req.body.email = req.session.user.email
        const newTodo = await Todo.create(req.body);
        res.redirect("/dashboard");
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/todo/:id', async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, { complete: true });
        const todos = await Todo.find({ email: req.session.user.email });
        res.render('todos.ejs', { todos });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/todo/:id/delete', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        const todos = await Todo.find({ email: req.session.user.email });
        res.render('todos.ejs', { todos });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Listening to http://localhost:${port}`);
});
