// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

struct BookStoreUser {
    uint256 id;
    address walletAddress;
    string username;
    string emailAddress;
    string password;
    bool isCreatingUser;
    bool isBlank;
}
