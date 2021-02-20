const pgp = require("pg-promise")();
const db = pgp(process.env.DATABASE_URL);

exports.query = async function (sql, args) {
  const res = await db.any(sql, args);
  return res;
};

exports.one = async function (sql, args) {
  const res = await db.oneOrNone(sql, args);
  return res;
};

exports.execute = async function (sql, args) {
  const res = await db.none(sql, args);
  return res;
};
