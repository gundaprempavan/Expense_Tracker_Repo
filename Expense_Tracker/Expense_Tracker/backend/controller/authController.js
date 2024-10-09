const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
const registerUser = async ({
  name,
  username,
  password,
  securityQuestion,
  securityAnswer,
}) => {
  // Validate input
  if (!name || !username || !password || !securityQuestion || !securityAnswer) {
    throw { status: 400, message: "All fields are required" };
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    throw { status: 400, message: "Username already exists" };
  }

  // Hash the password and security answer
  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedSecurityAnswer = await bcrypt.hash(securityAnswer, 10);

  // Create the user
  const user = await User.create({
    name,
    username,
    password: hashedPassword,
    securityQuestion,
    securityAnswer: hashedSecurityAnswer,
  });

  return {
    message: "User registered successfully!",
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
    },
  };
};

// Login user
const loginUser = async ({ username, password }) => {
  // Validate input
  if (!username || !password) {
    throw { status: 400, message: "Username and password are required" };
  }

  // Find the user
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw { status: 401, message: "Invalid credentials" };
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw { status: 401, message: "Invalid credentials" };
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "5h",
    }
  );

  return {
    message: "Login successful!",
    user: {
      id: user.id,
      username: user.username,
    },
    token,
  };
};

// Recover password
const recoverPassword = async ({ username, securityAnswer, newPassword }) => {
  // Validate input
  if (!username || !securityAnswer || !newPassword) {
    throw { status: 400, message: "All fields are required" };
  }

  // Find the user
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  // Verify the security answer
  const isSecurityAnswerValid = await bcrypt.compare(
    securityAnswer,
    user.securityAnswer
  );
  if (!isSecurityAnswerValid) {
    throw { status: 403, message: "Incorrect security answer" };
  }

  // Check if the new password is the same as the old password
  const isOldPassword = await bcrypt.compare(newPassword, user.password);
  if (isOldPassword) {
    throw { status: 400, message: "New password cannot be the same as the old password" };
  }

  // Hash and update the password
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return { message: "Password has been reset successfully!" };
};

module.exports = { registerUser, loginUser, recoverPassword };
