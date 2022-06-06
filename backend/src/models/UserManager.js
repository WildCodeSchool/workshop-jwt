const AbstractManager = require("./AbstractManager");

class UserManager extends AbstractManager {
  static table = "user";

  // TODO complete the `findByMail` method
  findByMail(email) {}

  insert(user) {
    return this.connection.query(
      `insert into ${UserManager.table} (email, password, role) values (?, ?, ?)`,
      [user.email, user.password, user.role]
    );
  }

  update(user) {
    return this.connection.query(
      `update ${UserManager.table} set email = ?, password = ?, role = ? where id = ?`,
      [user.email, user.password, user.role, user.id]
    );
  }
}

module.exports = UserManager;
