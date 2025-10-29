const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let users = [];

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
const SALT_ROUNDS = 10;

class UserService {
  async createUser(username, email, password) {
    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      throw new Error('User with this username or email already exists');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const id = uuidv4();
    const user = new User(id, username, email, passwordHash);
    
    users.push(user);
    return user;
  }

  getUserByUsername(username) {
    return users.find(u => u.username === username);
  }

  getUserByEmail(email) {
    return users.find(u => u.email === email);
  }

  getUserById(id) {
    return users.find(u => u.id === id);
  }

  async validatePassword(user, password) {
    return await bcrypt.compare(password, user.passwordHash);
  }

  generateToken(user) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  sanitizeUser(user) {
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = new UserService();
