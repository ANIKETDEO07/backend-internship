const express = require('express');
const db = require('../db/database');

const router = express.Router();

function parseTaskId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateTaskPayload(payload, isUpdate = false) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    errors.push('Request body must be a valid JSON object');
    return errors;
  }

  if (!isUpdate || payload.title !== undefined) {
    if (typeof payload.title !== 'string' || !payload.title.trim()) {
      errors.push('title is required and must be a non-empty string');
    }
  }

  if (payload.done !== undefined && typeof payload.done !== 'boolean') {
    errors.push('done must be a boolean');
  }

  if (isUpdate && payload.title === undefined && payload.done === undefined) {
    errors.push('At least one field (title or done) is required');
  }

  return errors;
}

router.get('/', async (req, res, next) => {
  try {
    const tasks = await db.getAllTasks();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const taskId = parseTaskId(req.params.id);
    if (!taskId) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = await db.getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const errors = validateTaskPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const newTask = await db.createTask({
      title: req.body.title.trim(),
      done: req.body.done === true,
    });

    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const taskId = parseTaskId(req.params.id);
    if (!taskId) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const errors = validateTaskPayload(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const updatedTask = await db.updateTask(taskId, {
      title: req.body.title !== undefined ? req.body.title.trim() : undefined,
      done: req.body.done,
    });

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const taskId = parseTaskId(req.params.id);
    if (!taskId) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const deleted = await db.deleteTask(taskId);
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
