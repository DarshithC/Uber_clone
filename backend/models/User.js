const { v4: uuidv4 } = require('uuid');

// In-memory storage (replace with MongoDB in production)
const users = [];

class User {
  constructor(name, email, password, phone, role = 'user') {
    this.id = uuidv4();
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.role = role;
    this.createdAt = new Date();
  }

  static create(userData) {
    const user = new User(
      userData.name,
      userData.email,
      userData.password,
      userData.phone,
      userData.role
    );
    users.push(user);
    return user;
  }

  static findByEmail(email) {
    return users.find(user => user.email === email);
  }

  static findById(id) {
    return users.find(user => user.id === id);
  }

  static getAll() {
    return users;
  }
}

module.exports = User;