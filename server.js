const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 8000;const cors=require('cors')
app.use(cors())

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mern-app')

.then(() => {
    console.log('DB connected');
})
.catch((err) => {
    console.log(err);
});


// Creating schema
const todoSchema = new mongoose.Schema({
    title:{
        required:true,
        type:String
    },
    description: String
});


// Creating model
const TodoModel = mongoose.model('ToDo', todoSchema);

// Creating item in MongoDB
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;

   
    try {
        const newTodo = new TodoModel({ title, description });
        await newTodo.save();
        res.status(201).json(newTodo);  // Send the saved todo item as a response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while saving the todo' });
    }
});


// Get all items from MongoDB
app.get('/todos', async (req, res) => {
    try {
        const todos = await TodoModel.find();  // Query all todo items from the database
        res.json(todos);  // Send the todos as a response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while retrieving the todos' });
    }
});

// Update a todo item
app.put('/todos/:id', async (req, res) => {
    try {
      const { title, description } = req.body;
      const id = req.params.id;
      const updatedTodo = await TodoModel.findByIdAndUpdate(
        id, 
        { title, description },
        { new: true }  // This ensures the updated document is returned
      );
  
    
      if (!updatedTodo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      res.json(updatedTodo);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // Deleting a Todo item
app.delete('/todos/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const deletedTodo = await TodoModel.findByIdAndDelete(id);
  
      if (!deletedTodo) {
        return res.status(404).json({ message: "Todo not found" });
      }
  
     
      res.status(204).end();  // No content, successfully deleted
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
    
app.listen(port, () => {
    console.log("Server is listening on port " + port);
});

