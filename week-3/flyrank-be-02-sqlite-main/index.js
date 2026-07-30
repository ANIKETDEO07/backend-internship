require('dotenv').config();
const express = require('express');
const tasksRouter = require('./src/routes/tasks');
const db = require('./src/db/database');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/tasks', tasksRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

async function start() {
  await db.initializeDatabase();
  app.listen(port, () => {
    console.log(`Task API running on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
