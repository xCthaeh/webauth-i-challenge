const express = require("express");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const bcrypt = require("bcryptjs");
const db = require("./data/dbConfig.js");
const port = 8000;

const server = express();

server.listen(port, () => {
  console.log(`Server is running on ... ${port}`);
});
