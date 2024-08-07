const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    // Fetch the list of books from the database (local in this case)
    const bookList = books;
    res.status(200).json(bookList);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book list." });
  }
});

// Get book details based on ISBN using Axios
public_users.get('/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;
  try {
    // Simulate fetching book details from a remote API using Axios
    const response = await axios.get(`http://example.com/api/books/${isbn}`);
    
    // If the request was successful, send the book details
    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      res.status(response.status).json({ message: "Book not found." });
    }
  } catch (error) {
    // Handle any errors that occur during the request
    res.status(500).json({ message: "Error retrieving book details." });
  }
});

// Get book details based on author using Axios
public_users.get('/author/:author', async (req, res) => {
  const { author } = req.params;
  try {
    // Simulate fetching book details from a remote API using Axios
    const response = await axios.get(`http://example.com/api/books/author/${author}`);
    
    // If the request was successful, send the book details
    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      res.status(response.status).json({ message: "No books found by this author." });
    }
  } catch (error) {
    // Handle any errors that occur during the request
    res.status(500).json({ message: "Error retrieving books by author." });
  }
});

// Get all books based on title using Axios
public_users.get('/title/:title', async (req, res) => {
  const { title } = req.params;
  try {
    // Simulate fetching book details from a remote API using Axios
    const response = await axios.get(`http://example.com/api/books/title/${title}`);
    
    // If the request was successful, send the book details
    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      res.status(response.status).json({ message: "No books found with this title." });
    }
  } catch (error) {
    // Handle any errors that occur during the request
    res.status(500).json({ message: "Error retrieving books by title." });
  }
});

// Get book review
public_users.get('/review/:isbn', async (req, res) => {
  const { isbn } = req.params;
  try {
    const book = books[isbn];
    if (book) {
      res.status(200).json(book.reviews);
    } else {
      res.status(404).json({ message: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book reviews." });
  }
});

// Register route
public_users.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists." });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully." });
});

module.exports.general = public_users;
