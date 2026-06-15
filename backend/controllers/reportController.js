const db = require('../config/database');

// Pure calculation logic
const calculateFinancials = ({
  investment = 0,
  profitAmount = 0,
  profitPercent = 60,
  outstandingAmount = 0,
  outstandingPercent = 60,
}) => {
  const maturityAmount = investment * 2;
  const profitValue = (profitAmount * profitPercent) / 100;
  const outstandingValue = (outstandingAmount * outstandingPercent) / 100;
  const totalValue = profitValue + outstandingValue;
  const leftoverValue = maturityAmount - totalValue;
  const transferValue = leftoverValue / 2;
  const monthlyProfit = transferValue * 0.02;

  return {
    maturityAmount,
    profitValue,
    outstandingValue,
    totalValue,
    leftoverValue,
    transferValue,
    monthlyProfit,
  };
};

exports.calculate = (req, res) => {
  const results = calculateFinancials(req.body);
  res.json(results);
};

exports.saveReport = (req, res, next) => {
  try {
    const body = req.body;
    const computed = calculateFinancials(body);
    
    const stmt = db.prepare(`
      INSERT INTO reports (
        client_name, currency, investment, months, profit_amount, profit_percent, 
        outstanding_amount, outstanding_percent, maturity_amount, profit_value, 
        outstanding_value, total_value, leftover_value, transfer_value, monthly_profit, created_at
      ) VALUES (
        @client_name, @currency, @investment, @months, @profit_amount, @profit_percent,
        @outstanding_amount, @outstanding_percent, @maturity_amount, @profit_value,
        @outstanding_value, @total_value, @leftover_value, @transfer_value, @monthly_profit, @created_at
      )
    `);

    const info = stmt.run({
      client_name: body.client_name || 'N/A',
      currency: body.currency || '₹',
      investment: Number(body.investment) || 0,
      months: body.months || '20 Months',
      profit_amount: Number(body.profitAmount) || 0,
      profit_percent: Number(body.profitPercent) || 60,
      outstanding_amount: Number(body.outstandingAmount) || 0,
      outstanding_percent: Number(body.outstandingPercent) || 60,
      maturity_amount: computed.maturityAmount,
      profit_value: computed.profitValue,
      outstanding_value: computed.outstandingValue,
      total_value: computed.totalValue,
      leftover_value: computed.leftoverValue,
      transfer_value: computed.transferValue,
      monthly_profit: computed.monthlyProfit,
      created_at: new Date().toISOString()
    });

    res.status(201).json({ id: info.lastInsertRowid, ...computed });
  } catch (error) {
    next(error);
  }
};

exports.getReports = (req, res, next) => {
  try {
    const reports = db.prepare('SELECT * FROM reports ORDER BY created_at DESC').all();
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

exports.getReportsByClient = (req, res, next) => {
  try {
    const { clientName } = req.params;
    const reports = db.prepare('SELECT * FROM reports WHERE client_name = ? ORDER BY created_at DESC').all(clientName);
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

exports.getReport = (req, res, next) => {
  try {
    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (error) {
    next(error);
  }
};

exports.deleteReport = (req, res, next) => {
  try {
    db.prepare('DELETE FROM reports WHERE id = ?').run(req.params.id);
    res.json({ message: 'Report deleted' });
  } catch (error) {
    next(error);
  }
};

exports.exportData = (req, res, next) => {
  try {
    const company = db.prepare('SELECT * FROM company WHERE id = 1').get();
    const clients = db.prepare('SELECT * FROM clients').all();
    const reports = db.prepare('SELECT * FROM reports').all();
    
    res.json({
      company,
      clients,
      reports,
      exportedAt: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

exports.clearData = (req, res, next) => {
  try {
    db.transaction(() => {
      db.prepare('DELETE FROM clients').run();
      db.prepare('DELETE FROM reports').run();
      db.prepare(`
        UPDATE company 
        SET name = 'SEA HOWLKS', phone_country = '', phone = '', email = '', generated_by = '' 
        WHERE id = 1
      `).run();
    })();
    res.json({ message: 'All data cleared successfully' });
  } catch (error) {
    next(error);
  }
};
