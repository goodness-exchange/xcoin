import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

// Use the same JWT secret as in your login API
const JWT_SECRET = 'your_jwt_secret_here';

const pool = new Pool({
  user: 'xcoin_user',
  host: 'localhost',
  database: 'xcoin',
  password: 'StrongPasswordHere', // Replace with your actual password
  port: 5432,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Expecting the header to be in the format "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const client = await pool.connect();
    const result = await client.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [decoded.id]
    );
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid token' });
  }
}
