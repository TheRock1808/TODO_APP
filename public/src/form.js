const { response } = require("express");

document.addEventListener('DOMContentLoaded', (event) => {
    fetchTodos();
});

document.getElementById('todoForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const task = document.getElementById('task').value;
    const desc = document.getElementById('desc').value;

    const todo = {
        task: task,
        description: desc
    };

    fetch('http://localhost:3000/api/todo/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Optionally, clear the form or provide user feedback here
        document.getElementById('todoForm').reset();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function fetchTodos(){
fetch('http://localhost:3000/api/todos')
.then(response => response.json())
.then(todos =>{
    forEach(todo => {
    addToList(todo);
});
})
.catch((error) => {
    console.error('Error fetching todos:', error);
});
}

function addToList(todo){
    const todoList = document.getElementById('todolist')
    const listItem = document.getElementById('li')
    listItem.className = 'list-group-item';
    listItem.textContent = `${todo.task}: ${todo.description}`;
    todoList.appendChild(listItem);
}