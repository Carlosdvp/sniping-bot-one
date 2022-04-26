

## Websockets - BSC

Single streams /ws/<streamName>

* URL connection

const accountAndOrderAndTransfers = new WebSocket("wss://dex.binance.org/api/ws/bnb1m4m9etgf3ca5wpgkqe5nr6r33a4ynxfln3yz4v");

* Or Subscribe method

const conn = new WebSocket("wss://dex.binance.org/api/ws");

conn.onopen = function(evt) {
  conn.send(JSON.stringify({ method: "subscribe", topic: "orders", address: "bnb1m4m9etgf3ca5wpgkqe5nr6r33a4ynxfln3yz4v" }));
}

### Actual Solution

const provider = new ethers.providers.WebSocketProvider(`wss://bsc.getblock.io/testnet/?api_key=${apiKey}`)


------------------------------------------------------

## Source Material

https://github.com/jklepatch/eattheblocks/blob/master/screencast/348-pancakeswap-trading-bot/bot.js

- made some edits based on another, similar project: How to Snipe BSC Token Launches
  - added a watcher bot just to make sure all the pieces are working
  - moved sensitive info to a .env file


-------------------------------------------------------

## Contents

- app.js
  - main sniper bot code

- watcherBot.js
  - simply watches for the PairCreated event