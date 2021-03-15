const express = require('express');
const massive = require('massive');
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

(async function() {
  const db = await massive(process.env.DATABASE_URL);
  app.get('/', function(req, res) {
    res.json({ status: 'OK' });
  });

  app.get('/api/users', async function(req, res) {
    try {
      const users = await db.users.find();
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
      const user = await db.users.find({ user_id: req.params.user_id });
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
      const data = await db.users.insert({
        username,
        email,
        full_name,
        created_on: 'NOW()'
      });
      res.status(201).json({ status: 'OK', data });
    } catch (error) {
      console.log(error);
      res.status(501).json({ status: 'KO', error });
    }
  });

  app.put('/api/users/:user_id', async function(req, res) {
    try {
      const result = await db.users.update(
        { user_id: req.params.user_id },
        { last_login: 'NOW()' }
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
      await db.users.destroy({ user_id: req.params.user_id });
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
})();
