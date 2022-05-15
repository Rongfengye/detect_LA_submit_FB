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
// Used to get information off of the chain
// Standard json rpc provider directly from ethers.js (Flashbots)
/* Inherits from JsonRPCProvider
    Which is a popular method for interacting with Ethereum
      - Is available in all major Ethereum node implementations
      - As well as many third-party web services
    The JsonRpcProvider connects to a JSON-RPC HTTP API using the URL
*/
var provider = new ethers_1.providers.StaticJsonRpcProvider(POLYGON_MATIC_RPC_URL);
// This provider should ONLY be used when it is known the network cannot change
// An ethers Provider will execute frequent 'getNetwork' calls and network being communicated with are consistent
// In the case of a client like MetaMask, this is desired as the network may be 
//    changed by the user at any time, in such cases the cost of checking 
//    the chainID is local and therefore cheap
// However, there are also many times where it is known the network cannot change
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var SAMPLE_TX_HASH;
        var _this = this;
        return __generator(this, function (_a) {
            console.log("Hitting the Ethereum RPC endpoint at" + POLYGON_MATIC_RPC_URL);
            provider.on('pending', function (pending_tx_hash) { return __awaiter(_this, void 0, void 0, function () {
                var pending_tx, iface, decodedData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log("New Pending Transction with Hash", pending_tx_hash);
                            return [4 /*yield*/, provider.getTransaction(pending_tx_hash)];
                        case 1:
                            pending_tx = _a.sent();
                            iface = new ethers_1.utils.Interface(abi_1.ABI);
                            decodedData = iface.parseTransaction({ data: pending_tx.data, value: pending_tx.value });
                            console.log("this is decoded DATA on the tx", decodedData);
                            if (pending_tx) {
                                console.log("This is the Pending Transaction Object", pending_tx);
                                if (pending_tx.data.indexOf("0xf305d719") !== -1) {
                                    console.log("is an addLiquidityETH call");
                                    console.log("This is the address of token", decodedData.args[0]);
                                }
                                if (pending_tx.data.indexOf("0xe8e33700") !== -1) {
                                    console.log("is an addLiquidity call");
                                    console.log("This is the address of first token", decodedData.args[0]);
                                    console.log("This is the address of second token", decodedData.args[1]);
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            SAMPLE_TX_HASH = "0x6c45dedcfc4e9ff44b4358adea4456a9f0ca407e2c2a2e29aa531a80108a5f26";
            return [2 /*return*/];
        });
    });
}
main();
