const userService = require('../services/UserService');

class UserController {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ 
          message: 'Missing required fields. Username, email, and password are required.' 
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ 
          message: 'Password must be at least 6 characters long' 
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          message: 'Invalid email format' 
        });
      }

      const user = await userService.createUser(username, email, password);
      const token = userService.generateToken(user);
      const sanitizedUser = userService.sanitizeUser(user);

      res.status(201).json({ 
        user: sanitizedUser, 
        token 
      });
    } catch (error) {
      if (error.message.includes('already exists')) {
        return res.status(409).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ 
          message: 'Username and password are required' 
        });
      }

      const user = userService.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ 
          message: 'Invalid username or password' 
        });
      }

      const isValidPassword = await userService.validatePassword(user, password);
      
      if (!isValidPassword) {
        return res.status(401).json({ 
          message: 'Invalid username or password' 
        });
      }

      const token = userService.generateToken(user);
      const sanitizedUser = userService.sanitizeUser(user);

      res.status(200).json({ 
        user: sanitizedUser, 
        token 
      });
    } catch (error) {
      res.status(500).json({ message: 'Error during login', error: error.message });
    }
  }

  getCurrentUser(req, res) {
    try {
      res.status(200).json({ user: req.user });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
  }
}

module.exports = new UserController();
