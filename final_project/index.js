const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
  // Get the token from the request header
  const token = req.headers['authorization'];

  // Check if the token is present
  if (!token) {
    return res.status(403).send({ message: "No token provided." });
  }

  // Verify the token
  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized: Invalid token." });
    }

    // Token is valid, store the decoded information in the request object
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
