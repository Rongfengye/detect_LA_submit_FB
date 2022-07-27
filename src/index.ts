// console.log("Hello world");
import { Contract, providers, BigNumber, utils } from "ethers";
import { EMIT_DETAILS_ADDRESS } from "./addresses";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import * as dotenv from "dotenv"
import { ABI, EMIT_DETAILS_ABI } from "./abi";
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
// More on Websockets https://ethereum.stackexchange.com/questions/82475/listening-to-events-in-ethers-js-with-websockets

const Uniswap_V2_router_addr = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
// acquired from https://ethereum.stackexchange.com/questions/92381/uniswap-v2-router-factory-on-rinkeby-testnet#:~:text=The%20Uniswap%20V2%20router%20address,interface%20to%20use%20the%20Router.


async function main() {
  // console.log("Hitting the Websocket endpoint at" + POLYGON_MATIC_RPC_URL);
  console.log("Hitting the Websocket endpoint at wss://speedy-nodes-nyc.moralis.io/5b4f2959281f08d79d7cf28b/eth/rinkeby/ws");

  // issue with the pending provider
  // https://ethereum.stackexchange.com/questions/119238/solved-cannot-find-my-pending-transactions-using-ether-js-provider-onpe
  
  // More information on web sockets: https://www.geeksforgeeks.org/what-is-web-socket-and-how-it-is-different-from-the-http/

  let num = 0;

  // Creating a new Interface Instance
  // To be able to decode or parse transaction data using Ethers.js we need to create a new interface instance
  // Then, we must use the correct ABI and match the data with the signature hash
  const iface = new utils.Interface(ABI);

  // The smart contract that I will be interacting with
  const emit_details_contract = new Contract(EMIT_DETAILS_ADDRESS, EMIT_DETAILS_ABI, provider);

  // eventually want to pause provider because of Error: Unexpected server response: 429, so that ideally this script can run forever
  // TO PREVENT ERROR 429
  //https://github.com/ethers-io/ethers.js/issues/1053
  let handle = provider.on('pending', async (pending_tx_hash) => {
    // console.log("New Pending Transction with Hash", pending_tx_hash);
    console.log("New Pending Transaction", num);
    num++;

    let pending_tx = await provider.getTransaction(pending_tx_hash);

    // console.log("The pending Transaction object is", pending_tx);
    // Found a valid transaction that is interacting with Uniswap
    if (pending_tx && pending_tx.to && (pending_tx.to === Uniswap_V2_router_addr)) {
      console.log("The pending Transaction object is", pending_tx);

      let decodedData = iface.parseTransaction({ data: pending_tx.data, value: pending_tx.value });

      console.log("this is decoded DATA on the tx", decodedData);

      // if (pending_tx.data.indexOf("0xf305d719") !== -1) {
      if (decodedData.name == "addLiquidityETH") {
        console.log("is an addLiquidityETH call");
        console.log("This is the address of token", decodedData.args[0]);



        // stright up call the function
        // then populate transaction
        
        // package it all into a bundle
        // simple bundle first, then look at simple arb to see how to put them right after each other

        // then need to write something that actually does the snipe
        // then bundle is correclty
        
        // call my arbitrage function here
        // first make the sol contract emit the values, which eventually is in the transaction logs and can be seen in the transaction receipt
        // https://codeburst.io/deep-dive-into-ethereum-logs-a8d2047c7371  looks into parsing log data
        //https://consensys.net/blog/developers/guide-to-events-and-logs-in-ethereum-smart-contracts/
        // https://cryptomarketpool.com/how-to-use-flashbots/

      // } else if (pending_tx.data.indexOf("0xe8e33700") !== -1) {
      } else if (decodedData.name == "addLiquidity") {
        console.log("is an addLiquidity call");
        console.log("This is the address of first token", decodedData.args[0]);
        console.log("This is the address of second token", decodedData.args[1]);

        // call my arbitrage function here
      } else {
        console.log("Function " + decodedData.name + " being called");
      }
    }

    // Now that we have found our pending transactions interacting with the Uniswap DApp
    // we need to feed our addresses into our snipeToken function
    // Use ethers.js to create a new Contract object of a solidity contract that calls swaptoken

    // Use ethers.js to organize the flashbots provider object and submit the bundle (HELPER FUNCTION)


  });

  

  console.log("THIS IS HANDLE", handle);
}


main();