import {pool} from '../db/connection.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


export async function register(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'email and password are required'
    });
  }

  try {
    const userExists = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({
        error: 'user already exists'
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email
      `,
      [email, password_hash]
    );

    return res.status(201).json({
      message: 'user created successfully',
      user: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'internal server error'
    });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'email and password are required'
    });
  }

  try {
    const result = await pool.query(
      `
      SELECT id, password_hash
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'invalid credentials'
      });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        error: 'invalid credentials'
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      message: 'login successful',
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'internal server error'
    });
  }
}