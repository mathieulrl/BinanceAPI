const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('binance_data.db');

// Create the "candle_data" table for storing data candles
function createDataCandlesTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS candle_data (
      Id INTEGER PRIMARY KEY,
      date INTEGER,
      high REAL,
      low REAL,
      open REAL,
      close REAL,
      volume REAL
    )
  `, (error) => {
    if (error) {
      console.error('Error creating data candles table:', error);
    } else {
      console.log('Data candles table created successfully.');
    }
  });


}

// Create the "trade_data" table for storing full data set
function createFullDataSetTable() {

  db.run(`
    CREATE TABLE IF NOT EXISTS trade_data (
      Id INTEGER PRIMARY KEY,
      uuid TEXT,
      traded_crypto REAL,
      price REAL,
      created_at_int INTEGER,
      side TEXT
    )
  `, (error) => {
    if (error) {
      console.error('Error creating full data set table:', error);
    } else {
      console.log('Full data set table created successfully.');
    }
  });


}

// Create the "last_checks" table for tracking updates
function createLastChecksTable() {

  db.run(`
    CREATE TABLE IF NOT EXISTS last_checks (
      Id INTEGER PRIMARY KEY,
      exchange TEXT,
      trading_pair TEXT,
      duration TEXT,
      table_name TEXT,
      last_check INTEGER,
      startdate INTEGER,
      last_id INTEGER
    )
  `, (error) => {
    if (error) {
      console.error('Error creating last checks table:', error);
    } else {
      console.log('Last checks table created successfully.');
    }
  });


}



createDataCandlesTable(); // Create the data candles table
createFullDataSetTable(); // Create the trade data table
createLastChecksTable(); // Create the last checks table

db.close();