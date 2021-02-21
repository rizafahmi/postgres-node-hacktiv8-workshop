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
    res.json({
      status: "OK",
      users,
    });
  } catch (error) {
    res.json({
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
    res.json({ status: "OK" });
  } catch (error) {
    res.json({ status: "KO", error });
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
    console.log(sql);
    const result = await db.one(`${sql};`, values);
    res.json({
      status: "OK",
      result,
    });
  } catch (error) {
    res.json({
      status: "KO",
      error,
    });
  }
});

app.listen(3456, function () {
  console.log(`Server running at port 3456`);
});
