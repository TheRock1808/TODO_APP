// const Todo = require('../models/Todo');

// To get specific Todo
exports.getTodoById = (req, res, next, todoId) => {
    TodoSchema.findById(todoId).exec((err, todo) => {
        if(err || !todo){
            return res.status(400).json({
                error:"404 todo not found",
            });
        }
        req.todo = todo;  //storing in the todo in req.todo for other functions to use it
        
        next(); //because this is a middleware
    });
}

// Prints all Todos
exports.getAllTodos = (req, res) => {
    Todo.find().sort("-createAt").exec((err, todos) => {
        if(err || !todos){
            return res.status(400).json({
                error:"Could'nt find all the todos",
            });
        }

        res.json(todos);
    });
};

// Create Todo
exports.createTodo = (req, res) => {
    const todo = new Todo({
        task: req.body.task,
        description: req.body.description
    });
    todo.save((err, todo) => {
        if (err || !task) {
            return res.status(400).json({
                error: 'Unable to create todo',
            });
        }
        res.json(todo);
    });
};

exports.getTodo = (req, res) => {
    return res.json(req.todo);
};

//Update todo
exports.updateTodo = (req, res) => {
    const todo = req.todo;
    todo.task = req.body.task;
    todo.desc = req.body.desc;

    todo.save((err, updatedTodo) => {
        if (err || !updatedTodo) {
            return res.status(400).json({
                error: 'Unable to update todo',
            });
        }
        res.json(updatedTodo);
    });
};

// Delete a todo
exports.deleteTodo = (req, res) => {
    const todo = req.todo;
    todo.remove((err, deletedTodo) => {
        if (err || !deletedTodo) {
            return res.status(400).json({
                error: 'Unable to delete todo',
            });
        }
        res.json({
            message: 'Todo deleted successfully',
        });
    });
};