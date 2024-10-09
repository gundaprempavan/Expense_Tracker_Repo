// // routes/securityRoutes.js
// const express = require('express');
// const User = require('../models/User'); // Ensure this path is correct
// const router = express.Router();

// // Set security questions
// router.post('/set-security-questions', async (req, res) => {
//   const { username, securityQuestion, securityAnswer } = req.body;

//   try {
//     // Find the user
//     const user = await User.findOne({ where: { username } });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Update security question and answer
//     user.securityQuestion = securityQuestion;
//     user.securityAnswer = securityAnswer; // Ideally, hash this answer
//     await user.save();

//     res.status(200).json({ message: 'Security questions set successfully!' });
//   } catch (error) {
//     console.error('Set security questions error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;
