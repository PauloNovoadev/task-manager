import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import { pool } from './connection.js';

async function test() {
  const result = await pool.query('SELECT NOW()');
  console.log('Banco respondeu:', result.rows);
  process.exit(0);
}

test().catch(err => {
  console.error('Erro na conexão:', err);
  process.exit(1);
});