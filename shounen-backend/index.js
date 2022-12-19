const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const events = require('./src/events');

const { db } = require('../config.json');

const connection = mysql.createConnection({
  host: db.options.host,
  user: db.username,
  password: db.password,
  database: db.database,
});

connection.connect();

const port = process.env.PORT || 8080;

const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(events(connection));

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});