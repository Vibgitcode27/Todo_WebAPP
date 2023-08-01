const express = require(`express`);
const fs = require(`fs`)
const cors = require(`cors`)
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

listener = () =>
{
    console.log(`HTTP server running at port ${port}`)
}

app.listen(port , listener)

app.use(cors())

app.use(bodyParser.json())

getTodos = (req , res) =>
{
    fs.readFile(`todo.json` , `utf-8` , (err , data) =>
    {
        if(err) throw err;
        let response = JSON.parse(data)
        res.status(200).json(response)
    })
}

app.get(`/todos` , getTodos)

getTodosID = (req ,res) =>
{
    fs.readFile(`todo.json` , `utf-8` , (err ,data) =>
    {
        if(err) throw err;
        const todos = JSON.parse(data)
        let todoid = todos.find(todoid => todoid.id == req.params.id)
        if(todoid == null)
        {
            res.status(404).send(`Cannot find todo`);
        }
        else
        {
            res.status(200).send(todoid);
        }
    })
}

app.get(`/todos/:id` , getTodosID)

postTodos = (req ,res) =>
{
    fs.readFile(`todo.json` , `utf-8` , (err , data) =>
    { 
        if(err) throw err;
        let newTodo = {
            id : Math.floor(Math.random()*10000000) ,
            title : req.body.title ,
            status : req.body.status ,
            description : req.body.description
        }
        let todo = JSON.parse(data)
        todo.push(newTodo)
        fs.writeFile(`todo.json` , JSON.stringify(todo) , (err) =>
        {
            if(err) throw err;
            res.status(201).json(newTodo)
        })
    })
}

app.post(`/todos` , postTodos)

putTodos = (req,res) =>
{
    fs.readFile(`todo.json` , `utf-8` , (err , data) =>
    {
        if(err) throw err;
        let todos = JSON.parse(data)
        const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
        if (todoIndex === -1) {
          res.status(404).send(`Cannot find todo with mentioned ID`);
        } else {
          let updatedTodo = {
            id : todos[todoIndex].id ,
            title : req.body.title,
            status : req.body.status,
            description: req.body.description
          }
          todos[todoIndex] = updatedTodo
        }
        fs.writeFile(`todo.json` , JSON.stringify(todos) , (err) =>
        {
            if(err) throw err 
            res.status(201).send(todos[todoIndex])
        })
    })
}

app.put(`/todos/:id` , putTodos)

deleteTodos = (req , res) =>
{
    fs.readFile(`todo.json` , `utf-8` , (err, data) =>
    {   
        if(err) throw err;
        const todos = JSON.parse(data)
        const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
      if (todoIndex == -1) {
        res.status(404).send("Cannot find mentioned ID");
      } else {
        todos.splice(todoIndex , 1)
        fs.writeFile(`todo.json` , JSON.stringify(todos) , (err) =>
        {
            if (err) throw err
              res.status(201).send("Deleted");
        })
    }
    })
}

app.delete(`/todos/:id` , deleteTodos)