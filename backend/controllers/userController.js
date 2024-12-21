import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const authController = {
  // Google OAuth authentication
  async googleAuth(req, res) {
    try {
      const { token } = req.body;

      // Verify Google token
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const { email, name, picture, sub: googleId } = ticket.getPayload();

      // Find or create user
      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          email,
          username: name,
          googleId,
          profilePicture: picture,
          password: Math.random().toString(36), // Random password for Google users
        });
      }

      // Create JWT token
      const jwtToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ token: jwtToken, user });

    } catch (error) {
      console.error('Google auth error:', error);
      res.status(401).json({ error: 'Authentication failed' });
    }
  },

  // Regular email/password registration
  async register(req, res) {
    try {
      const { email, password, username } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        return res.status(400).json({
          error: 'Email or username already exists'
        });
      }

      // Create new user
      const user = await User.create({
        email,
        password,
        username
      });

      // Create JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({ token, user });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  // Regular email/password login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Create JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ token, user });

    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ error: 'Authentication failed' });
    }
  }
};