"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// console.log("Hello world");
var ethers_1 = require("ethers");
var dotenv = require("dotenv");
var abi_1 = require("./abi");
dotenv.config();
// Ethereum RPC Endpoint that will be hit by providers
// Acquired from https://rpc.info/
// const POLYGON_MATIC_RPC_URL = process.env.POLYGON_MATIC_RPC_URL || ""
var POLYGON_MATIC_RPC_URL = "https://rpc.ankr.com/eth";
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
var provider = new ethers_1.providers.WebSocketProvider("wss://speedy-nodes-nyc.moralis.io/5b4f2959281f08d79d7cf28b/eth/rinkeby/ws", "rinkeby");
// More on Websockets https://ethereum.stackexchange.com/questions/82475/listening-to-events-in-ethers-js-with-websockets
var Uniswap_V2_router_addr = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
// acquired from https://ethereum.stackexchange.com/questions/92381/uniswap-v2-router-factory-on-rinkeby-testnet#:~:text=The%20Uniswap%20V2%20router%20address,interface%20to%20use%20the%20Router.
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var num, handle;
        var _this = this;
        return __generator(this, function (_a) {
            // console.log("Hitting the Websocket endpoint at" + POLYGON_MATIC_RPC_URL);
            console.log("Hitting the Websocket endpoint at wss://speedy-nodes-nyc.moralis.io/5b4f2959281f08d79d7cf28b/eth/rinkeby/ws");
            num = 0;
            handle = provider.on('pending', function (pending_tx_hash) { return __awaiter(_this, void 0, void 0, function () {
                var pending_tx, iface, decodedData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // console.log("New Pending Transction with Hash", pending_tx_hash);
                            console.log("New Pending Transaction", num);
                            num++;
                            return [4 /*yield*/, provider.getTransaction(pending_tx_hash)];
                        case 1:
                            pending_tx = _a.sent();
                            // console.log("The pending Transaction object is", pending_tx);
                            if (pending_tx && pending_tx.to && (pending_tx.to === Uniswap_V2_router_addr)) {
                                console.log("The pending Transaction object is", pending_tx);
                                iface = new ethers_1.utils.Interface(abi_1.ABI);
                                decodedData = iface.parseTransaction({ data: pending_tx.data, value: pending_tx.value });
                                console.log("this is decoded DATA on the tx", decodedData);
                                if (pending_tx.data.indexOf("0xf305d719") !== -1) {
                                    console.log("is an addLiquidityETH call");
                                    console.log("This is the address of token", decodedData.args[0]);
                                }
                                else if (pending_tx.data.indexOf("0xe8e33700") !== -1) { // CHange checking decodedData.name
                                    console.log("is an addLiquidity call");
                                    console.log("This is the address of first token", decodedData.args[0]);
                                    console.log("This is the address of second token", decodedData.args[1]);
                                }
                                else {
                                    console.log("Function " + decodedData.name + " being called");
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            // TO PREVENT ERROR 429
            //https://github.com/ethers-io/ethers.js/issues/1053
            console.log("THIS IS HANDLE", handle);
            return [2 /*return*/];
        });
    });
}
main();
