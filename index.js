const express = require("express");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const bcrypt = require("bcryptjs");
const db = require("./data/dbConfig.js");
const port = 8000;

const server = express();


server.get('/api/me', protected, (req, res) => {
  db('users')
  .select('id', 'username', 'password')
  .where({ id: req.session.user })
  .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});



server.get('/api/users', protected, (req, res) => {
    db('users')
    .select('id', 'username', 'password')
    .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
});

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('Error occurred. Could not log out.');
      } else {
        res.send('Hope to see you back soon!');
      }
    });
  } 
});


server.listen(port, () => {
  console.log(`Server is running on ... ${port}`);
});
