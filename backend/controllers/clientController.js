const db = require('../config/database');

exports.getClients = (req, res, next) => {
  try {
    // Get all clients, newest first
    const clients = db.prepare('SELECT * FROM clients ORDER BY created_at DESC LIMIT 20').all();
    res.json(clients);
  } catch (error) {
    next(error);
  }
};

exports.addClient = (req, res, next) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Client name is required' });
    }

    const trimmedName = name.trim();

    // Check if client already exists
    const existing = db.prepare('SELECT id FROM clients WHERE name = ?').get(trimmedName);
    
    if (existing) {
      // Update created_at to bump it to the top
      db.prepare('UPDATE clients SET created_at = ? WHERE id = ?').run(new Date().toISOString(), existing.id);
      return res.json({ id: existing.id, name: trimmedName, message: 'Client updated' });
    }

    const stmt = db.prepare('INSERT INTO clients (name, created_at) VALUES (?, ?)');
    const info = stmt.run(trimmedName, new Date().toISOString());
    
    res.status(201).json({ id: info.lastInsertRowid, name: trimmedName });
  } catch (error) {
    next(error);
  }
};

exports.deleteClient = (req, res, next) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM clients WHERE id = ?').run(id);
    res.json({ message: 'Client deleted' });
  } catch (error) {
    next(error);
  }
};
