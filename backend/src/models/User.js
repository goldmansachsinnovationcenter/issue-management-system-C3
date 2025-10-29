class User {
  constructor(id, username, email, passwordHash, createdAt = new Date().toISOString()) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
  }
}

module.exports = User;
