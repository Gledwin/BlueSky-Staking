//SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

import {ERC20} from "stakingERC20.sol";


contract RewardToken is ERC20{
    constructor(uint256 initialSupply) ERC20("RewardToken", "cUSD"){
        _mint(msg.sender, initialSupply*10**18);
    }
  
}