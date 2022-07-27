//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

pragma experimental ABIEncoderV2;

contract EmitTxDetails {
  // Declaring an event
  // https://www.tutorialspoint.com/solidity/solidity_events.htm
  // An event is emitted, it stores the arguments passed in transaction logs. 
  // These logs are stored on blockchain and are accessible using address of the 
  // contract till the contract is present on the blockchain
  // https://betterprogramming.pub/learn-solidity-events-2801d6a99a92
  event Snipe(uint256 _ethAmountToCoinbase, uint amountIn, uint amountOutMin, 
              address[] path, address _to, uint deadline, uint[] amounts);

  event Log(string msg);

  bool fallBackCalled;

  // the hardhat test should see if the tx logs persist

  constructor() {
    emit Log("Deploying the EmitTxDetails contract");
  }

  receive() external payable {
    emit Log("In the receive function of EmittingTxDetails");
  }

  fallback() external payable {
    emit Log("In the fallback function of EmittingTxDetails");
    fallBackCalled = true;
  }

  // Same arguments as snipeToken 
  function LogTxDetails (uint256 _ethAmountToCoinbase,
                        uint amountIn, uint amountOutMin, 
                        address[] calldata path, address _to, 
                        uint deadline, uint[]memory amounts) 
                        external payable {

  emit Snipe(_ethAmountToCoinbase, amountIn, amountOutMin, 
              path, _to, deadline, amounts);
  }
}

// https://www.tutorialspoint.com/solidity/solidity_view_functions.htm, events modify state of blockchain
// https://remix.ethereum.org/#optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.7+commit.e28d00a7.js
// Deployed at 0xb92A0Fb8067570932251c288A0a42C649423A3A4
// On etherscan https://rinkeby.etherscan.io/tx/0x25502f082d2b34aa177345eaebfde43306f00e23995d34b68fb7d6fa65af8060