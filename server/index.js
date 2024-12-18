const express = require("express");
const app = express();
const cors = require("cors");
const pool = require('./db');
require("dotenv").config();

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json()); // Allows access to req.body

// Initialize Database
const initializeDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS todos (
                todo_id SERIAL PRIMARY KEY,
                description TEXT NOT NULL
            );
        `);
        console.log("Database initialized!");
    } catch (err) {
        console.error("Database initialization failed:", err.message);
    }
};

// Routes
app.get('/todos', async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todos");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.get('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM todos WHERE todo_id = $1", [id]);
        res.json(todo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.post('/todos', async (req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todos (description) VALUES($1) RETURNING *",
            [description]
        );
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query(
            "UPDATE todos SET description = $1 WHERE todo_id = $2 RETURNING *",
            [description, id]
        );
        res.json("The todo is updated!");
    } catch (err) {
        console.error(err.message);
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query(
            "DELETE FROM todos WHERE todo_id = $1 RETURNING *",
            [id]
        );
        res.json("The todo is deleted!");
    } catch (err) {
        console.error(err.message);
    }
});

// Start Server and Initialize Database
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await initializeDatabase();
});
