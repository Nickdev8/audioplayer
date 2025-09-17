import Database from 'better-sqlite3';
const db = new Database('test.db');
db.close();
console.log('better-sqlite3 initialized and closed successfully!');