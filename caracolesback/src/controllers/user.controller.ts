import {  pool  } from '../config/database';
import bcrypt from 'bcrypt';

const getUsers = async (req: any, res: any, next: any) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error: any) {
    next(error);
  }
};

const updateUser = async (req: any, res: any, next: any) => {
  try {
    const { id } = req.params;
    const { name, email, password, confirm_password } = req.body;
    
    if (password && password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const userCheck = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    let query = 'UPDATE users SET ';
    const values: any[] = [];
    let count = 1;

    if (name) {
      query += `name = $${count}, `;
      values.push(name);
      count++;
    }
    if (email) {
      query += `email = $${count}, `;
      values.push(email);
      count++;
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      query += `password = $${count}, `;
      values.push(hashedPassword);
      count++;
    }

    if (values.length === 0) {
      return res.status(400).json({ error: 'No fields provided to update' });
    }

    query = query.slice(0, -2);
    query += ` WHERE id = $${count} RETURNING id, name, email, created_at`;
    values.push(id);

    const updatedUser = await pool.query(query, values);
    res.status(200).json(updatedUser.rows[0]);
  } catch (error: any) {
    next(error);
  }
};

const deleteUser = async (req: any, res: any, next: any) => {
  try {
    const { id } = req.params;
    const deleteResult = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    next(error);
  }
};

const getUserById = async (req: any, res: any, next: any) => {
  try {
    const { id } = req.params;
    const userResult = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(userResult.rows[0]);
  } catch (error: any) {
    next(error);
  }
};

export { 
  getUsers,
  getUserById,
  updateUser,
  deleteUser
 };
