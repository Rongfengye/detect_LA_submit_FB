// console.log("Hello world");
import { Contract, providers, BigNumber, utils } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import * as dotenv from "dotenv"
import { ABI } from "./abi";
dotenv.config();

// Ethereum RPC Endpoint that will be hit by providers
// Acquired from https://rpc.info/
// const POLYGON_MATIC_RPC_URL = process.env.POLYGON_MATIC_RPC_URL || ""
const POLYGON_MATIC_RPC_URL = "https://rpc.ankr.com/eth"
// RIGHT NOT ITS NOT THE POLYGON ONE

// Used to get information off of the chain
// Standard json rpc provider directly from ethers.js (Flashbots)
/* Inherits from JsonRPCProvider
    Which is a popular method for interacting with Ethereum 
      - Is available in all major Ethereum node implementations
      - As well as many third-party web services
    The JsonRpcProvider connects to a JSON-RPC HTTP API using the URL
*/
// const provider = new providers.StaticJsonRpcProvider(POLYGON_MATIC_RPC_URL);
// This provider should ONLY be used when it is known the network cannot change
// An ethers Provider will execute frequent 'getNetwork' calls and network being communicated with are consistent
// In the case of a client like MetaMask, this is desired as the network may be 
//    changed by the user at any time, in such cases the cost of checking 
//    the chainID is local and therefore cheap
// However, there are also many times where it is known the network cannot change


// We are going to use a websocket provider
const provider = new providers.WebSocketProvider("wss://speedy-nodes-nyc.moralis.io/5b4f2959281f08d79d7cf28b/eth/rinkeby/ws", "rinkeby");

const Uniswap_V2_router_addr = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
// acquired from https://ethereum.stackexchange.com/questions/92381/uniswap-v2-router-factory-on-rinkeby-testnet#:~:text=The%20Uniswap%20V2%20router%20address,interface%20to%20use%20the%20Router.

async function main() {
  // console.log("Hitting the Websocket endpoint at" + POLYGON_MATIC_RPC_URL);
  console.log("Hitting the Websocket endpoint at wss://speedy-nodes-nyc.moralis.io/5b4f2959281f08d79d7cf28b/eth/rinkeby/ws");

  // issue with the pending provider
  // https://ethereum.stackexchange.com/questions/119238/solved-cannot-find-my-pending-transactions-using-ether-js-provider-onpe
  
  // More information on web sockets: https://www.geeksforgeeks.org/what-is-web-socket-and-how-it-is-different-from-the-http/

  let num = 0;
  
  provider.on('pending', async (pending_tx_hash) => {
    // console.log("New Pending Transction with Hash", pending_tx_hash);
    console.log("New Pending Transaction", num);
    num++;

    let pending_tx = await provider.getTransaction(pending_tx_hash);

    // console.log("The pending Transaction object is", pending_tx);
    if (pending_tx && pending_tx.to && (pending_tx.to === Uniswap_V2_router_addr)) {
      console.log("The pending Transaction object is", pending_tx);

      // Creating a new Interface Instance
      // To be able to decode or parse transaction data using Ethers.js we need to create a new interface instance
      // Then, we must use the correct ABI and match the data with the signature hash
      const iface = new utils.Interface(ABI);
      let decodedData = iface.parseTransaction({ data: pending_tx.data, value: pending_tx.value });

      console.log("this is decoded DATA on the tx", decodedData);

      if (pending_tx.data.indexOf("0xf305d719") !== -1) {
        console.log("is an addLiquidityETH call");
        console.log("This is the address of token", decodedData.args[0]);

      } else if (pending_tx.data.indexOf("0xe8e33700") !== -1) {
        console.log("is an addLiquidity call");
        console.log("This is the address of first token", decodedData.args[0]);
        console.log("This is the address of second token", decodedData.args[1]);
      } else {
        console.log("Function " + decodedData.name + " being called");
      }
    }
  })

  // index of method in transaction .data

  // all liquidity pool ABIs are the same
  

  // Use metamask to initialize an addLiquidity to polygon network
  // A ethers Contract object requires:
  //    - Contract address (transaction object [to])
  //    - ABI (all liquidity pool ABIs are the same)
  //    - provider (which we have)

  // console.log that we have detected it
  // https://www.reddit.com/r/ethdev/comments/numhsu/getting_filtered_pending_transactions_with/
  //https://ethereum.stackexchange.com/questions/111643/how-do-you-resolve-and-end-pending-transaction-checks-in-ethers-js

  // liqduity pool was initialized at tx https://etherscan.io/tx/0x4a5410e7a9d56c10a1f063e1ba5a8902980072ecb959c154b38dd2a02493718a

  const SAMPLE_TX_HASH = "0x6c45dedcfc4e9ff44b4358adea4456a9f0ca407e2c2a2e29aa531a80108a5f26"; 
  // Transaction hash calling 
  // addLiquidityETH(address token, uint256 amountTokenDesired, uint256 amountTokenMin,
  //                 uint256 amountETHMin, address to, uint256 deadline)
  // 

  // https://etherscan.io/tx/0x6c45dedcfc4e9ff44b4358adea4456a9f0ca407e2c2a2e29aa531a80108a5f26
  // liquidity pool exists at https://etherscan.io/token/0x13c69aa8bf77f49508750d792976dacd91c41714?a=0x38bf5c9d2e32c1bfcd5f15081799b3f8f3658556#readContract 


  // const SAMPLE_TX_HASH = "0x55fafb6f2f7facbda7576c76570f51fc51d0adcd689d3bd41b3002a22b37b52d"; // USDC WETH add liqudity
  
  
  // provider.getTransaction(SAMPLE_TX_HASH).then((tx_Object) => {
  //   console.log("this is GET TRANSACTION", tx_Object);
  //   // console.log("this is data", tx_Object.data);

  //   // Creating a new Interface Instance
  //   // To be able to decode or parse transaction data using Ethers.js we need to create a new interface instance
  //   // Then, we must use the correct ABI and match the data with the signature hash
  //   const iface = new utils.Interface(ABI);
  //   let decodedData = iface.parseTransaction({ data: tx_Object.data, value: tx_Object.value });

  //   console.log("this is decoded DATA on the addLiquidityETH tx", decodedData);

  //   console.log("should be address to", decodedData.args[4]);

  //   if (tx_Object.data.indexOf("0xf305d719") !== -1) {
  //     console.log("This is the data field", tx_Object.data);
  //     console.log("the index is", tx_Object.data.indexOf("0xf305d719"));
  //   }
  // });

  

  // This needs to be mined tho
  // provider.getTransactionReceipt(SAMPLE_TX_HASH).then((tx_Object) => {console.log("this is GET TRANSACTION RECEIPT", tx_Object)});


}


main();