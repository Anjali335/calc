const Database = require('better-sqlite3');
const path = require('path');

// Connect to SQLite database in the 'data' directory
const dbPath = path.resolve(__dirname, '../data/database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

// Initialize database tables
const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS company (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT DEFAULT 'SEA HOWLKS',
      phone_country TEXT,
      phone TEXT,
      email TEXT,
      generated_by TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_name TEXT,
      currency TEXT,
      investment REAL,
      months TEXT,
      profit_amount REAL,
      profit_percent REAL,
      outstanding_amount REAL,
      outstanding_percent REAL,
      maturity_amount REAL,
      profit_value REAL,
      outstanding_value REAL,
      total_value REAL,
      leftover_value REAL,
      transfer_value REAL,
      monthly_profit REAL,
      created_at TEXT
    );
  `);

  // Ensure the single company record exists
  const companyCount = db.prepare('SELECT COUNT(*) as count FROM company WHERE id = 1').get();
  if (companyCount.count === 0) {
    db.prepare(`
      INSERT INTO company (id, name, phone_country, phone, email, generated_by, updated_at) 
      VALUES (1, 'SEA HOWLKS', '', '', '', '', ?)
    `).run(new Date().toISOString());
  }
};

initDb();

module.exports = db;
