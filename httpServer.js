import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// In-memory task array for HTTP server operations
let tasks = [
    { id: 1, taskName: "Design Database Schema", assignedTo: "Rahul Sharma", status: "Completed" },
    { id: 2, taskName: "Develop Login API", assignedTo: "Priya Singh", status: "Pending" }
];

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // Route: GET /
    if (pathname === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Welcome to Employee Task Management System</h1>');
    }
    // Route: GET /about
    else if (pathname === '/about' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h2>Employee Task Management Application</h2><p>Built using Node.js HTTP and FS modules.</p>');
    }
    // Route: GET /home (Static File Serving using FS module)
    else if (pathname === '/home' && method === 'GET') {
        const filePath = path.join(__dirname, 'public', 'index.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Internal Server Error: Unable to read file" }));
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }
    // Route: GET /tasks
    else if (pathname === '/tasks' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
    }
    // Route: POST /add-task
    else if (pathname === '/add-task' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newTask = JSON.parse(body);
                const { id, taskName, assignedTo, status } = newTask;

                if (!id || !taskName || !assignedTo || !status) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Missing required fields: id, taskName, assignedTo, status" }));
                    return;
                }

                tasks.push(newTask);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Task added successfully", task: newTask }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Invalid JSON format" }));
            }
        });
    }
    // Route: 404 Not Found
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "404 Route Not Found" }));
    }
});

server.listen(PORT, () => {
    console.log(`HTTP Server running at http://localhost:${PORT}`);
});