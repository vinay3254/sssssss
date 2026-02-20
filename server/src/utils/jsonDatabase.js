import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

class JsonDatabase {
  async readUsers() {
    try {
      const data = await fs.readFile(USERS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async writeUsers(users) {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  }

  async findUserByEmail(email) {
    const users = await this.readUsers();
    const needle = (email || '').trim().toLowerCase();
    return users.find(user => (user.email || '').trim().toLowerCase() === needle);
  }

  async createUser(userData) {
    const users = await this.readUsers();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: (userData.email || '').trim().toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      isVerified: false
    };

    users.push(newUser);
    await this.writeUsers(users);
    return newUser;
  }

  async validatePassword(email, password) {
    const user = await this.findUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async updateUserPassword(email, newPassword) {
    const users = await this.readUsers();
    const needle = (email || '').trim().toLowerCase();
    const userIndex = users.findIndex(user => (user.email || '').trim().toLowerCase() === needle);
    
    if (userIndex === -1) return false;
    
    users[userIndex].password = await bcrypt.hash(newPassword, 10);
    await this.writeUsers(users);
    return true;
  }
}

export default new JsonDatabase();