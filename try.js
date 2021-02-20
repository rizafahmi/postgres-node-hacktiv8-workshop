const pgp = require("pg-promise")();
const db = pgp(process.env.DATABASE_URL);

async function select() {
  try {
    const data = await db.any(`SELECT * FROM users`);
    console.log(data.length);
  } catch (error) {
    console.log(error);
  }
}

select();

async function insert() {
  try {
    await db.none(
      `INSERT INTO users (username, email, full_name, created_on) VALUES ('rizafahmi', 'me@rizafahmi.com', 'Riza Fahmi', NOW());`
    );
    console.log("Insert data success");
  } catch (error) {
    console.log(error);
  }
}

insert();

async function update() {
  try {
    const data = await db.one(
      `UPDATE users SET username='rizafahmi' WHERE user_id=1001 RETURNING *;`
    );
    console.log(data);
    console.log("Update data success");
  } catch (error) {
    console.log(error);
  }
}

update();

async function remove() {
  try {
    await db.none(`DELETE FROM users WHERE user_id=1001;`);
    console.log("Delete data success");
  } catch (error) {
    console.log(error);
  }
}

remove();
