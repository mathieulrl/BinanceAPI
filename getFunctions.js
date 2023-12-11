const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

async function getListCryptocurrencies() {

    axios.get('https://api.binance.com/api/v3/exchangeInfo')
  .then(response => {
    const symbols = response.data.symbols;
    const cryptocurrencies = symbols.map(symbol => symbol.baseAsset);
    console.log(cryptocurrencies);
  })
  .catch(error => {
    console.error('Error retrieving cryptocurrencies:', error);
  });

}

async function getDepth(direction , pair ) {
    try {
      const response = await axios.get(`https://api.binance.com/api/v3/depth?symbol=${pair}`);
      const depthData = response.data;
  
      if (direction === 'ask') {
        const askPrice = depthData.asks[0][0]; // Get the first ask price
        console.log(`Ask Price for ${pair}: ${askPrice}`);
      } else if (direction === 'bid') {
        const bidPrice = depthData.bids[0][0]; // Get the first bid price
        console.log(`Bid Price for ${pair}: ${bidPrice}`);
      } else {
        console.error('Invalid direction. Please specify either "ask" or "bid".');
      }
    } catch (error) {
      console.error('Error retrieving depth:', error);
    }
  }
  
async function getOrderBook(symbol) {
    try {
      const response = await axios.get(`https://api.binance.com/api/v3/depth?symbol=${symbol}`);
      const orderBook = response.data;
  
      console.log(`Order Book for ${symbol}:`);
      console.log('Asks:');
      console.log(orderBook.asks);
      console.log('Bids:');
      console.log(orderBook.bids);
    } catch (error) {
      console.error('Error retrieving order book:', error);
    }
  }
  
  

async function refreshDataCandle(pair, duration ) {
    const db = new sqlite3.Database('binance_data.db');
  
    try {
      // Get the timestamp of the last stored candle
      const lastTimestamp = await getLastStoredCandleTimestamp(db);
  
      // Retrieve latest candle data from the API
      const response = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${duration}&startTime=${lastTimestamp + 1}`);
      const candles = response.data;
  
      // Prepare the INSERT statement for candle_data table
      const stmt = db.prepare(`
        INSERT INTO candle_data ( date, high, low, open, close, volume)
        VALUES ( ?, ?, ?, ?, ?, ?)
      `);
      
      console.log(`Candles for ${pair} (${duration}):`);
      console.log('---------------------------------');

      candles.forEach(candle => {
        const [date, high, low, open, close, volume] = candle;
  
        stmt.run(date, high, low, open, close, volume);

        
        
        const formattedCandle = {
          Time: new Date(date),
          Open: parseFloat(open),
          High: parseFloat(high),
          Low: parseFloat(low),
          Close: parseFloat(close),
          Volume: parseFloat(volume),
        };
    
          console.log(formattedCandle);
        });
    
        console.log('---------------------------------');
  
      stmt.finalize();
  
      console.log('Candle data has been updated in the database.');

    // Update the last check timestamp in the last_checks table
    updateLastCheck(db, 'candle_data', lastTimestamp, pair);
  
    } catch (error) {
      console.error('Error retrieving candle data:', error);
    } finally {
      db.close();
    }
  }
  
  // Retrieve the timestamp of the last stored candle
  function getLastStoredCandleTimestamp(db) {
    return new Promise((resolve, reject) => {
      db.get('SELECT MAX(date) AS lastTimestamp FROM candle_data', (error, row) => {
        if (error) {
          reject(error);
        } else {
          resolve(row.lastTimestamp || 0);
        }
      });
    });
  }
  


async function refreshData(pair) {
    const db = new sqlite3.Database('binance_data.db');
  
    try {
      // Get the last stored trade data ID for the trading pair
      const lastId = await getLastStoredTradeDataId(db, pair);
  
      // Retrieve all trade data from the API
      const response = await axios.get(`https://api.binance.com/api/v3/trades?symbol=${pair}`);
      const trades = response.data;
  

      // Prepare the INSERT statement for trade_data table
      const stmt = db.prepare(`
        INSERT INTO trade_data (Id, uuid, traded_crypto, price, created_at_int, side)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

     
      trades.forEach(trade => {
        const { id, symbol, price, qty, time, isBuyerMaker } = trade;
  
        stmt.run(id, symbol, qty, price, time, isBuyerMaker ? 'SELL' : 'BUY');

        // Print the trade data
      console.log(`Trade ID: ${id}`);
      console.log(`Symbol: ${pair}`);
      console.log(`Price: ${price}`);
      console.log(`Quantity: ${qty}`);
      console.log(`Time: ${time}`);
      console.log(`Side: ${isBuyerMaker ? 'SELL' : 'BUY'}`);
      console.log('---');
      
      });
  
      stmt.finalize();
  
      console.log('Trade data has been updated in the database.');

    // Update the last check ID in the last_checks table
    updateLastCheck(db, 'trade_data', lastId, pair);
  
    } catch (error) {
      console.error('Error retrieving trade data:', error);
    } finally {
      db.close();
    }
  }
  
  // Retrieve the last stored trade data ID for the trading pair
function getLastStoredTradeDataId(db, pair) {
    return new Promise((resolve, reject) => {
      db.get('SELECT MAX(Id) AS lastId FROM trade_data WHERE traded_crypto = ?', [pair], (error, row) => {
        if (error) {
          reject(error);
        } else {
          resolve(row.lastId || 0);
        }
      });
    });
  }
  
function updateLastCheck(db, tableName, lastValue, pair) {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO last_checks (exchange, trading_pair, table_name, last_check, startdate, last_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
  
    stmt.run('binance', pair, tableName, Date.now(), Date.now(), lastValue);
  
    stmt.finalize();
  }


//getListCryptocurrencies();

//getDepth('ask', 'BTCUSDT'); 
//getDepth('bid', 'ETHUSDT'); 

//getOrderBook('XRPUSDT'); 


//run "node createDatabase.js" from the command line to create the database :

//refreshDataCandle('BTCUSDT', '5m');

refreshData('BTCUSDT'); 