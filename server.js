const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const port = 3000

app.use(express.json())
app.set("view engine","hbs")
app.set("views", path.join(__dirname,"templates"))


app.get('/', (req, res) => {
  res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
  })

app.get('/signup', (req, res) => {
    res.render('signup')
})
app.listen(port, () => {
    console.log(`Server listening on port ${port} at http://localhost:${port}`)
  }) 