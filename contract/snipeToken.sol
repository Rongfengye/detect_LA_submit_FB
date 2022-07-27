//SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.13;

pragma experimental ABIEncoderV2;

contract Snipe1 {

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

  

  
  }
}

