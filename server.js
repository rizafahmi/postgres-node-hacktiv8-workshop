const express = require("express");
const bodyParser = require("body-parser");

const db = require("./lib/pg/runner.js");

const app = express();
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.json({ status: "OK" });
});

app.get("/api/users", async function (req, res) {
  try {
    const users = await db.query(`SELECT * FROM users LIMIT 100;`);
    res.status(200).json({
      status: "OK",
      users,
    });
  } catch (error) {
    res.status(500).json({
      status: "KO",
      error,
    });
  }
});

app.post("/api/users", async function (req, res) {
  const { username, email, full_name } = req.body;
  try {
    await db.execute(
      `INSERT INTO users (username, email, full_name, created_on) VALUES ($1, $2, $3, NOW())`,
      [username, email, full_name]
    );
    res.status(201).json({ status: "OK" });
  } catch (error) {
    res.status(501).json({ status: "KO", error });
  }
});

app.put("/api/users/:user_id", async function (req, res) {
  try {
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    let sql = "UPDATE users SET ";
    for (let i = 0; i < keys.length; i++) {
      sql += `${keys[i]}=$${i + 1},`;
    }
    sql = sql.slice(0, -1);
    sql += ` WHERE user_id=${req.params.user_id} RETURNING *`;
    const result = await db.one(`${sql};`, values);
    res.status(202).json({
      status: "OK",
      result,
    });
  } catch (error) {
    res.status(502).json({
      status: "KO",
      error,
    });
  }
});

app.delete("/api/users/:user_id", async function (req, res) {
  try {
    await db.execute(`DELETE FROM users WHERE user_id=$1`, req.params.user_id);
    res.status(200).json({
      status: "OK",
    });
  } catch (error) {
    res.status(500).json({
      status: "KO",
      error,
    });
  }
});

app.listen(3456, function () {
  console.log(`Server running at port 3456`);
});
