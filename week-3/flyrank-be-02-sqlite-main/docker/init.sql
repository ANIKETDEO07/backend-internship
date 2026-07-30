CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done BOOLEAN DEFAULT FALSE
);

INSERT INTO tasks (title, done)
SELECT 'Learn PostgreSQL integration', false
WHERE NOT EXISTS (SELECT 1 FROM tasks);

INSERT INTO tasks (title, done)
SELECT 'Build the Task API with SQL', false
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Build the Task API with SQL');

INSERT INTO tasks (title, done)
SELECT 'Verify data persistence after restart', false
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Verify data persistence after restart');
