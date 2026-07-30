const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL must be set in environment variables');
}

// Configure a small connection pool for the containerized Postgres setup.
const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

function mapTask(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    done: row.done,
  };
}

async function waitForDatabase() {
  const maxRetries = 10;
  const retryDelay = 1500;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.warn(`Database connection attempt ${attempt} failed. Retrying in ${retryDelay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
}

async function initializeDatabase() {
  await waitForDatabase();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      done BOOLEAN DEFAULT FALSE
    );
  `);

  const countResult = await pool.query('SELECT COUNT(*) AS count FROM tasks');
  const count = Number(countResult.rows[0].count);

  if (count === 0) {
    await pool.query(`
      INSERT INTO tasks (title, done)
      VALUES ($1, $2), ($3, $4), ($5, $6);
    `, [
      'Learn PostgreSQL integration', false,
      'Build the Task API with SQL', false,
      'Verify data persistence after restart', false,
    ]);
  }
}

module.exports = {
  initializeDatabase,
  getAllTasks: async () => {
    const result = await pool.query('SELECT id, title, done FROM tasks ORDER BY id');
    return result.rows.map(mapTask);
  },
  getTaskById: async (id) => {
    const result = await pool.query('SELECT id, title, done FROM tasks WHERE id = $1', [id]);
    return mapTask(result.rows[0]);
  },
  createTask: async (task) => {
    const result = await pool.query(
      'INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING id, title, done',
      [task.title, task.done],
    );
    return mapTask(result.rows[0]);
  },
  updateTask: async (id, task) => {
    const existingResult = await pool.query('SELECT id, title, done FROM tasks WHERE id = $1', [id]);
    const existing = existingResult.rows[0];
    if (!existing) return null;

    const updatedTitle = task.title !== undefined ? task.title : existing.title;
    const updatedDone = task.done !== undefined ? task.done : existing.done;

    const result = await pool.query(
      'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING id, title, done',
      [updatedTitle, updatedDone, id],
    );

    return mapTask(result.rows[0]);
  },
  deleteTask: async (id) => {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return result.rowCount > 0;
  },
};
