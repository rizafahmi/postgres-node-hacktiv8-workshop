const express = require('express');
const bodyParser = require('body-parser');

const db = require('./lib/pg/runner.js');
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'riza',
    password: 'riza',
    database: 'chats'
  }
});

const app = express();
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.json({ status: 'OK' });
});

app.get('/api/users', async function(req, res) {
  try {
    const users = await knex.select('*').from('users');
    res.status(200).json({
      status: 'OK',
      users
    });
  } catch (error) {
    res.status(500).json({
      status: 'KO',
      error
    });
  }
});

app.get('/api/users/:user_id', async function(req, res) {
  try {
    const user = await knex
      .select('*')
      .from('users')
      .where({ user_id: req.params.user_id });
    res.status(200).json({
      status: 'OK',
      user
    });
  } catch (error) {
    res.status(500).json({
      status: 'KO',
      error
    });
  }
});

app.post('/api/users', async function(req, res) {
  const { username, email, full_name } = req.body;
  try {
    const data = await knex('users')
      .insert({ username, email, full_name, created_on: 'NOW()' })
      .returning('*');
    res.status(201).json({ status: 'OK', data });
  } catch (error) {
    console.log(error);
    res.status(501).json({ status: 'KO', error });
  }
});

app.put('/api/users/:user_id', async function(req, res) {
  try {
    const result = await knex('users')
      .update({ last_login: 'NOW()' })
      .where({ user_id: req.params.user_id })
      .returning('*');
    res.status(202).json({
      status: 'OK',
      result
    });
  } catch (error) {
    res.status(502).json({
      status: 'KO',
      error: error.toString()
    });
  }
});

app.delete('/api/users/:user_id', async function(req, res) {
  try {
    await knex('users')
      .where({ user_id: req.params.user_id })
      .del();
    res.status(200).json({
      status: 'OK'
    });
  } catch (error) {
    res.status(500).json({
      status: 'KO',
      error: error.toString()
    });
  }
});

app.listen(3456, function() {
  console.log(`Server running at port 3456`);
});
