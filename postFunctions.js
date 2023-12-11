require('dotenv').config(); // Load the .env file

const axios = require('axios');
const crypto = require('crypto');

function createOrder(direction, price, amount, pair, orderType ) {
  const apiKey = process.env.API_KEY; // Access the API key from the environment variables
  const secretKey = process.env.SECRET_KEY; // Access the secret key from the environment variables

  const baseUrl = 'https://api.binance.com';
  const endpoint = '/api/v3/order';

  // Generate a timestamp for the request
  const timestamp = Date.now();

  // Create the query parameters
  const params = {
    symbol: pair,
    side: direction,
    type: orderType,
    price: price,
    quantity: amount,
    timestamp: timestamp,
    recvWindow: 5000, // Optional parameter to specify the request timeout
  };

  // Create the signature for the request
  const queryString = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(queryString)
    .digest('hex');

  // Add the API key and signature to the request headers
  const headers = {
    'X-MBX-APIKEY': apiKey,
  };

  // Send the POST request to create the order
  axios
    .post(baseUrl + endpoint, params, { headers })
    .then(response => {
      console.log('Order created successfully');
    })
    .catch(error => {
      console.log('Failed to create order');
      console.error(error.response.data);
    });
}


function cancelOrder(uuid, pair) {
  const apiKey = process.env.API_KEY; // Access the API key from the environment variables
  const secretKey = process.env.SECRET_KEY; // Access the secret key from the environment variables
  

  const baseUrl = 'https://api.binance.com';
  const endpoint = '/api/v3/order';

  // Generate a timestamp for the request
  const timestamp = Date.now();

  // Create the query parameters
  const params = {
    symbol: pair,
    orderId: uuid,
    timestamp: timestamp,
    recvWindow: 5000, // Optional parameter to specify the request timeout
  };

  // Create the signature for the request
  const queryString = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(queryString)
    .digest('hex');

  // Add the API key and signature to the request headers
  const headers = {
    'X-MBX-APIKEY': apiKey,
  };

  // Send the DELETE request to cancel the order
  axios
    .delete(baseUrl + endpoint, { params, headers })
    .then(response => {
      console.log('Order canceled successfully');
    })
    .catch(error => {
      console.log('Failed to cancel order');
      console.error(error.response.data);
    });
}




// Call the function to create the order
const direction = 'BUY'; // or 'SELL'
const price = 50000;
const amount = 0.5;

createOrder(direction, price, amount);


// Call the function to cancel the order
const orderId = '123456789'; 
const tradingPair = 'BTCUSDT'; 
cancelOrder(orderId, tradingPair);