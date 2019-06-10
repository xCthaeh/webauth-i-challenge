const express = require("express");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const bcrypt = require("bcryptjs");
const db = require("./data/dbConfig.js");
const port = 8000;

const server = express();

const sessionConfig = {
  secret: 'this is my secret',
  cookie: {
      maxAge: 1000 * 60 * 10,
      secure: false
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false
  store: new KnexSessionStore({
    tablename: 'sessions',
    seedfieldname: 'sid',
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 60
}

server.use(session(sessionConfig))
server.use(express.json());
server.use(cors());

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

server.post('/api/login', (req, res) => {
  const creds = req.body;

  db('users')
      .where({username: creds.username})
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(creds.password, user.password)) {
            req.session.userId = user.id;
          res.status(200).json({ message: 'Login was successful.' });
        } else {
          res.status(401).json({ message: 'You shall not pass!' });
        }
      })
      .catch(err => res.json(err));
  });


server.post('/api/register', (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 4); 
  creds.password = hash;

  db('users')
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => json(err));
});
server.listen(port, () => {
  console.log(`Server is running on ... ${port}`);
});
