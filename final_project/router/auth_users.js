const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username is valid
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Authenticate user credentials
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Middleware to authenticate JWT token and extract username from it
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ message: 'No token provided.' });

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });
    req.user = user;
    next();
  });
};

// Login route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Validate user credentials
  if (authenticatedUser(username, password)) {
    // Generate a JWT token
    const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });

    // Send the token in the response
    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ message: "Invalid username or password." });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", authenticateToken, (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const { username } = req.user;

  // Check if review is provided
  if (!review) {
    return res.status(400).json({ message: "Review is required." });
  }

  // Find the book using ISBN
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Add or modify the review
  book.reviews[username] = review;

  // Respond with a success message
  return res.status(200).json({ message: "Review added/modified successfully." });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", authenticateToken, (req, res) => {
  const { isbn } = req.params;
  const { username } = req.user;

  // Find the book using ISBN
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Check if the user has reviewed this book
  if (book.reviews[username]) {
    // Delete the review
    delete book.reviews[username];

    // Respond with a success message
    return res.status(200).json({ message: "Review deleted successfully." });
  } else {
    // Respond with an error message if the user has not reviewed the book
    return res.status(404).json({ message: "No review found from this user." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
