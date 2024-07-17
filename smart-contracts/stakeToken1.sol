//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {ERC20} from "stakingERC20.sol";

contract StakeToken is ERC20{
    constructor(uint256 initialSupply) ERC20("StakeToken", "cUSD"){
        _mint(msg.sender, initialSupply*10**18);
    }
  
}

