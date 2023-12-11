# BinanceAPI
School project : Use Crypto Exchange APIs

## Quickstart :
• Create the database with createDatabase.js before starting

• This code uses axios and sqlite3.

• For the refreshDataCandle and refreshData functions, the updates are stored in the LastChecks table in the database.

• Uncomment the lines at the end of the .js files to test each function.



## Tasks list - GET (in getFunctions.js) :
• Get a list of all available cryptocurrencies and display it  
• Create a function to display the ’ask’ or ‘bid’ price of an asset. Direction and asset name as parameters def getDepth(direction='ask', pair = 'BTCUSD')  
• Get order book for an asset  
• Create a function to read agregated trading data (candles) def refreshDataCandle(pair = 'BTCUSD', duration = '5m’)  
• Create a sqlite table to store said data (schema attached in the next slide)  
• Store candle data in the db • Modify refreshDataCandle() to update when new candle data is available  
• Create a function to extract all available trade data def refreshData(pair = 'BTCUSD’)  
• Store the data in sqlite  

## Tasks list – POST (in postFunctions.js) :
• Create an order def createOrder(api_key, secret_key, direction, price, amount, pair ='BTCUSD_d', orderType = 'LimitOrder’)  
• Cancel an order def cancelOrder(api_key, secret_key, uuid)  
