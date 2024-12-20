import User from '../models/User.js';

export const createTestUser = async (req, res) => {
  try {
    const existingTestUser = await User.findOne({ isTestUser: true });
    
    if (existingTestUser) {
      return res.status(200).json(existingTestUser);
    }

    const testUser = new User({
      username: 'TestChefUser',
      email: 'test_chef@example.com',
      isTestUser: true
    });

    await testUser.save();
    res.status(201).json(testUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating test user', error: error.message });
  }
};

export const getTestUser = async (req, res) => {
  try {
    const testUser = await User.findOne({ isTestUser: true });
    
    if (!testUser) {
      return res.status(404).json({ message: 'No test user found' });
    }

    res.status(200).json(testUser);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching test user', error: error.message });
  }
};