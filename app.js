const express = require('express');
const path = require('path');
const ejs = require('ejs');
const Todo = require('./models/Todo');

const port = 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json());

app.get("/", async (req, res) => {
    const todos = await Todo.find({});
    res.render("index.ejs", { todos });
  });

app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find({});
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
        const newTodo = await Todo.create(req.body);
        res.redirect("/");
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/todo/:id', async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, { complete: true });
        const todos = await Todo.find({});
        res.render('todos.ejs', { todos });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/todo/:id/delete', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        const todos = await Todo.find({});       
        res.render('todos.ejs', { todos });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Listening to http://localhost:${port}`);
});
