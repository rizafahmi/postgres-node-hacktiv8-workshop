const express = require('express');
const massive = require('massive');
const { sequelize, User } = require('./models/index.js');
const bodyParser = require('body-parser');

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
    const users = await User.findAll();
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
    const user = await User.findOne({
      where: { id: req.params.user_id }
    });
    res.status(200).json({
      status: 'OK',
      user
    });
  } catch (error) {
    res.status(500).json({
      status: 'KO',
      error: error.toString()
    });
  }
});

app.post('/api/users', async function(req, res) {
  const { username, email, full_name } = req.body;
  try {
    const data = await User.create({ username, email, full_name });
    res.status(201).json({ status: 'OK', data });
  } catch (error) {
    console.log(error);
    res.status(501).json({ status: 'KO', error });
  }
});

app.put('/api/users/:user_id', async function(req, res) {
  try {
    const result = await User.update(
      { full_name: 'Sequelize Rocks!' },
      { where: { id: req.params.user_id } }
    );
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
    await User.destroy({ where: { id: req.params.user_id } });
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

app.listen(3456, async function() {
  await sequelize.sync({ force: true });
  console.log(`Server running at port 3456`);
});
