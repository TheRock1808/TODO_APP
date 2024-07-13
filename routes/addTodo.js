const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

router.post('/createTodo', (req, res) => {
    try {
      const { task } = req.body;
      const newTodo = new Todo( { task } );
      newTodo.save();
      res.render(`
        <li class="list-group-item">${newTodo.task}</li>
      `);
    } catch (error) {
      console.error('Error creating todo:', error);
      res.status(500).send('Internal Server Error');
    }
});
  
router.get('/index', (req, res) => {
    try {
        const todos = Todo.find().exec();
        res.send(todos.map(todo => `
        <li class="list-group-item">${todo.task}</li>
        `).join(''));
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Export the router
module.exports = router;
