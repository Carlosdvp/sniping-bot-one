// import dependencies
const ethers = require('ethers')
require('dotenv').config();

// API info
const apiKey = process.env.API_KEY

// WBNB: Token address
// Router: PancakeSwap router contract
// Target: your wallet address
const addresses = {
	wBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
	factory:'0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
	router: '0x10ed43c718714eb63d5aa57b78b54704e256024e',
	target: process.env.address
}

// Wallet and WS node information
const mnemonic = process.env.mnemonic
const provider = new ethers.providers.WebSocketProvider(`wss://bsc.getblock.io/testnet/?api_key=${apiKey}`)
const wallet = ethers.Wallet.fromMnemonic(mnemonic)
const account = wallet.connect(provider)

//
// Connect to the Factory Contract
const factory = new ethers.Contract(
		addresses.factory,
		['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
		account
	);

//
// Connect to the Router Contract
const router = new ethers.Contract(addresses.router, 
	[    
		'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'
	],
	account)

//
// Sniper Function
const observerBot = async () => {
	// Start Watching for new pairs
	factory.on('PairCreated', async (token0, token1, pairAddress) => {
	  console.log(`
	    New pair detected
	    =================
	    token0: ${token0}
	    token1: ${token1}
	    pairAddress: ${pairAddress}
	  `);
	});
}


//
// Activate the Watcher Bot
(async () => {
	await observerBot()
})();