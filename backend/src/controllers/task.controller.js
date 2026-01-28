import { pool } from '../db/connection.js';

export async function listTasks(req, res) {
  try {
    const result = await pool.query(
      `
      SELECT id, title, completed, created_at
      FROM tasks
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.userId]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal server error' });
  }
}

export async function createTask(req, res) {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'title is required' });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO tasks (user_id, title)
      VALUES ($1, $2)
      RETURNING id, title, completed, created_at
      `,
      [req.userId, title.trim()]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal server error' });
  }
}

export async function updateTask(req, res) {
  const { id } = req.params;
  const { title, completed } = req.body;

  const hasTitle = typeof title === 'string';

  
  const hasCompleted =
    completed === true ||
    completed === false ||
    completed === 'true' ||
    completed === 'false';

  if (!hasTitle && !hasCompleted) {
    return res.status(400).json({
      error: 'send at least one of: title (string), completed (boolean)'
    });
  }

  const normalizedTitle = hasTitle ? title.trim() : null;
  if (hasTitle && normalizedTitle.length === 0) {
    return res.status(400).json({ error: 'title cannot be empty' });
  }

  const normalizedCompleted =
    completed === true || completed === 'true'
      ? true
      : completed === false || completed === 'false'
      ? false
      : null;

  try {
    const result = await pool.query(
      `
      UPDATE tasks
      SET
        title = COALESCE($1, title),
        completed = COALESCE($2, completed)
      WHERE id = $3 AND user_id = $4
      RETURNING id, title, completed, created_at
      `,
      [
        hasTitle ? normalizedTitle : null,
        hasCompleted ? normalizedCompleted : null,
        id,
        req.userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'task not found' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal server error' });
  }
}

export async function deleteTask(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM tasks
      WHERE id = $1 AND user_id = $2
      RETURNING id
      `,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'task not found' });
    }

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal server error' });
  }
}