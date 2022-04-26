// dependencies
const ethers = require('ethers');

// addresses we will use, some of these could/should be moved to an .env file
const addresses = {
	wBNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
	factory:'0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
	router:'0x10ED43C718714eb63d5aA57B78B54704E256024E',
	wallet:'0x140a3080C7C4EA2ede4F72443a5B564cd4366918' // Firefox Metamask - Acct. 2
}

// this address should have enough BNB to pay for the fees
const mnemonic = 'step kingdom milk shiver barrel autumn acquire blossom chunk comfort call swing';
// websocket provider
// const conn = new WebSocket("wss://dex.binance.org/api/");

const provider = new ethers.providers.WebSocketProvider('wss://dex.binance.org/api/');
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
const account = wallet.connect(provider);

// initialize the contracts
let factory = new ethers.Contract(
		addresses.factory,
		['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
		account
	);

let router = new ethers.Contract(
		addresses.router,
		[
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
  	],
  	account
	);

let wBNB = new ethers.Contract(
		addresses.wBNB,
		['function approve(address spender, uint amount) public returns(bool)'],
		account
	);

//
// initializing function
const init = async() => {
	// approve token for spending, set BNB amiount for the trades as a string: tradeAmount = '0.1'
	var tx = await wBNB.approve(addresses.router, tradeAmount);

	var receipt = await tx.wait();
	console.log('Tx receipt');
	console.log(receipt);
}

//
// Start Watching for new pairs
factory.on('PairCreated', async (token0, token1, pairAddress) => {
  console.log(`
    New pair detected
    =================
    token0: ${token0}
    token1: ${token1}
    pairAddress: ${pairAddress}
  `);
	// the new token's pair needs to be wBNB
	let tokenIn, tokenOut;

	if (token0 === addresses.wBNB) {
		tokenIn = token0;
		tokenOut = token1;
	}

	if (token1 === addresses.wBNB) {
		tokenIn = token1;
		tokenOut = token0;
	}

	// otherwise if the pair is not wBNB
	if (typeof tokenIn === 'undefined') {
		return;
	}

	//
	// Buy 0.1 BNB of the new token
	var amountIn = ethers.utils.parseUnits('0.1', 'ether');
	var amount = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);

	// Execution price may be different so we need some flexibility
	var amountOutMin = amounts[1].sub([1].div(10));

	console.log(`
	  Buying new token
	  =================
	  tokenIn: ${amountIn.toString()} ${tokenIn} (WBNB)
	  tokenOut: ${amounOutMin.toString()} ${tokenOut}
	`);

	// send the transaction
	var tx = await router.swapExactTokensForTokens(
		amountIn,
		amountOutMin,
		[tokenIn, tokenOut],
		addresses.recipient,
		Date.now() + 1000 * 60 * 10 // 10 minutes from this moment
	);

	var receipt = await tx.wait();
	console.log('Transaction receipt:', receipt);
});


// start the application
init();