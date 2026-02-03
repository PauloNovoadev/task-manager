import { pool } from "../db/connection.js";

const ALLOWED_STATUS = new Set(["todo", "in_progress", "done"]);

export async function listTasks(req, res) {
  try {
    const result = await pool.query(
      `
      SELECT id, title, status, created_at
      FROM tasks
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.userId]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
}

export async function createTask(req, res) {
  const { title, status } = req.body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ error: "title is required" });
  }

  // status é opcional; se vier, valida
  if (status !== undefined) {
    if (typeof status !== "string" || !ALLOWED_STATUS.has(status)) {
      return res.status(400).json({
        error: "status must be one of: todo, in_progress, done",
      });
    }
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO tasks (user_id, title, status)
      VALUES ($1, $2, COALESCE($3, 'todo'))
      RETURNING id, title, status, created_at
      `,
      [req.userId, title.trim(), status ?? null]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
}

export async function updateTask(req, res) {
  const { id } = req.params;
  const { title, status } = req.body;

  const hasTitle = typeof title === "string";
  const hasStatus = typeof status === "string";

  if (!hasTitle && !hasStatus) {
    return res.status(400).json({
      error: "send at least one of: title (string), status (todo|in_progress|done)",
    });
  }

  let normalizedTitle = null;
  if (hasTitle) {
    normalizedTitle = title.trim();
    if (normalizedTitle.length === 0) {
      return res.status(400).json({ error: "title cannot be empty" });
    }
  }

  let normalizedStatus = null;
  if (hasStatus) {
    normalizedStatus = status;
    if (!ALLOWED_STATUS.has(normalizedStatus)) {
      return res.status(400).json({
        error: "status must be one of: todo, in_progress, done",
      });
    }
  }

  try {
    const result = await pool.query(
      `
      UPDATE tasks
      SET
        title = COALESCE($1, title),
        status = COALESCE($2, status)
      WHERE id = $3 AND user_id = $4
      RETURNING id, title, status, created_at
      `,
      [hasTitle ? normalizedTitle : null, hasStatus ? normalizedStatus : null, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "task not found" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
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
      return res.status(404).json({ error: "task not found" });
    }

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
}