const db = require('../config/database');

exports.getCompany = (req, res, next) => {
  try {
    const company = db.prepare('SELECT * FROM company WHERE id = 1').get();
    res.json(company);
  } catch (error) {
    next(error);
  }
};

exports.updateCompany = (req, res, next) => {
  try {
    const { name, phone_country, phone, email, generated_by } = req.body;
    
    const stmt = db.prepare(`
      UPDATE company 
      SET name = @name, 
          phone_country = @phone_country, 
          phone = @phone, 
          email = @email, 
          generated_by = @generated_by,
          updated_at = @updated_at
      WHERE id = 1
    `);
    
    stmt.run({
      name,
      phone_country,
      phone,
      email,
      generated_by,
      updated_at: new Date().toISOString()
    });

    const updatedCompany = db.prepare('SELECT * FROM company WHERE id = 1').get();
    res.json(updatedCompany);
  } catch (error) {
    next(error);
  }
};
