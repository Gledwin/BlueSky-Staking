//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {ERC20} from "stakingERC20.sol";

contract StakeToken is ERC20{
    constructor(uint256 initialSupply) ERC20("StakeToken", "STK"){
        _mint(msg.sender, initialSupply*10**18);
    }
  
}

//0x5053b19741dade3a67dd7b0e3c3bb9b450aaf95a