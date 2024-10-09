const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(db, username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.collection('users').insertOne({ username, password: hashedPassword });
}

async function loginUser(db, username, password) {
  const user = await db.collection('users').findOne({ username });
  if (!user) {
    throw new Error('User not found');
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
}

module.exports = { registerUser, loginUser };