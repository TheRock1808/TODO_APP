const express = require('express');
const path = require('path');
const hbs = require('hbs');
const index = require('./routes/index');
const todoRoutes = require('./routes/addTodo');

const port = 3000;
const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(express.json());

app.use('/', index);
app.use('/createTodo', todoRoutes);

app.listen(port, () => {
    console.log(`Listening to http://localhost:${port}`);
});
