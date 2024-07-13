const express = require('express')
const router = express.Router()
const Todo = require('../models/Todo')

router.get('/', async(req, res) => {
    const allTodo = await Todo.find();
    res.render('index', {todo: allTodo}); 
});

module.exports = router