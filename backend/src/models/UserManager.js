const AbstractManager = require("./AbstractManager");

class UserManager extends AbstractManager {
  static table = "user";

  // TODO complete the `findByMail` method
  findByMail(email) {
    return this.connection.query(
      `select * from ${UserManager.table} where email = ?`,
      [email]
    );
  }

  insert(user) {
    return this.connection.query(
      `insert into ${UserManager.table} (email, password, name) values (?, ?, ?)`,
      [user.email, user.password, user.name]
    );
  }

  update(user) {
    return this.connection.query(
      `update ${UserManager.table} set email = ?, password = ?, name = ? where id = ?`,
      [user.email, user.password, user.name, user.id]
    );
  }
}

module.exports = UserManager;
