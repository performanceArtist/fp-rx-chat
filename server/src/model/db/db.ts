import { Database } from 'sqlite3';

export const db = new Database('src/model/db/db.sqlite3', error => {
  if (error) {
    return console.error(error.message);
  }

  db.run(
    `CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid text,
    username text,
    email text UNIQUE,
    password text,
    CONSTRAINT email_unique UNIQUE (email)
    CONSTRAINT uid UNIQUE (uid)
    )`,
    err => {
      if (err) {
        return;
      } else {
        const insert =
          'INSERT INTO user (uid, username, email, password) VALUES (?,?,?,?)';
        db.run(insert, [
          Math.random().toString(),
          'test',
          'test@example.com',
          'test',
        ]);
      }
    },
  );
});

