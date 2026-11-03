import express from 'express';

const app = express();
const PORT = 4000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initial array of tasks
let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending",
        priority: "High"
    },
    {
        id: 2,
        taskName: "Setup Database Schema",
        assignedTo: "Priya Singh",
        status: "In Progress",
        priority: "Medium"
    },
    {
        id: 3,
        taskName: "Write Unit Tests",
        assignedTo: "Ankit Verma",
        status: "Completed",
        priority: "Low"
    }
];

// GET /tasks - Retrieve all tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// GET /tasks/:id - Retrieve a task by ID
app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
});

// POST /tasks - Add a new task
app.post('/tasks', (req, res) => {
    const { id, taskName, assignedTo, status, priority } = req.body;

    if (!id || !taskName || !assignedTo || !status || !priority) {
        return res.status(400).json({ error: "All fields (id, taskName, assignedTo, status, priority) are required" });
    }

    const existingTask = tasks.find(t => t.id === parseInt(id, 10));
    if (existingTask) {
        return res.status(400).json({ error: "Task with this ID already exists" });
    }

    const newTask = { id: parseInt(id, 10), taskName, assignedTo, status, priority };
    tasks.push(newTask);

    res.status(201).json({
        message: "Task added successfully",
        task: newTask
    });
});

// PUT /tasks/:id - Update task details
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    const { taskName, assignedTo, status, priority } = req.body;

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...(taskName && { taskName }),
        ...(assignedTo && { assignedTo }),
        ...(status && { status }),
        ...(priority && { priority })
    };

    res.status(200).json({
        message: "Task updated successfully",
        task: tasks[taskIndex]
    });
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    res.status(200).json({
        message: "Task deleted successfully",
        task: deletedTask
    });
});

// Handle invalid endpoints
app.use((req, res) => {
    res.status(404).json({ error: "Route Not Found" });
});

app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}`);
});