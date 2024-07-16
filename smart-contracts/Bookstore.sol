// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

import {BookStoreUser} from "./BookstoreStructs.sol";
import {ERC20} from "./BookstoreInterface.sol";



contract Bookstore {
    BookStoreUser[] private allBookStoreUsers;
   
    address public bookStorewnerAddress;

    uint256 private currentUserId;

    ERC20 cUSD = ERC20(0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1);

    

    constructor(address _bookStoreOwnerAddress) {
        bookStorewnerAddress = _bookStoreOwnerAddress;
    }

   

    modifier onlyCreatingUser(address _walletAddress) {
        BookStoreUser memory checkingUser = getUserByWalletAddress(
            _walletAddress
        );
        require(
            checkingUser.isCreatingUser,
            "Only a creating user can perform this action."
        );
        _;
    }

    modifier onlyExistingUser() {
        require(
            checkIfUserExists(msg.sender),
            "Only existing users can perform this action."
        );
        _;
    }

    function checkIfUserExists(address _walletAddress)
        public
        view
        returns (bool)
    {
        for (uint256 userId = 0; userId < allBookStoreUsers.length; userId++) {
            BookStoreUser memory currentUser = allBookStoreUsers[userId];
            if (
                currentUser.walletAddress == _walletAddress &&
                !currentUser.isBlank
            ) {
                return true;
            }
        }

        return false;
    }

    

    function createUser(string memory _username, string memory _emailAddress, string  memory _password)
        public
        returns (BookStoreUser memory)
    {
        bool userExists = checkIfUserExists(msg.sender);

        if (userExists) {
            return getUserByWalletAddress(msg.sender);
        }

        uint256 newUserId = currentUserId;

        allBookStoreUsers.push(
            BookStoreUser(
                newUserId,
                msg.sender,
                _username,
                _emailAddress,
                _password,
                false,
                false
            )
        );

        currentUserId++;

        BookStoreUser memory newUser = getUserByUserId(newUserId);

        return newUser;
    }

    function getUserByWalletAddress(address _walletAddress)
        public
        view
        returns (BookStoreUser memory)
    {
        for (uint256 userId = 0; userId < allBookStoreUsers.length; userId++) {
            BookStoreUser memory currentUser = allBookStoreUsers[userId];
            if (currentUser.walletAddress == _walletAddress) {
                return currentUser;
            }
        }
        BookStoreUser memory blankUser;
        blankUser.isBlank = true;
        return blankUser;
    }

    function getUserByUserId(uint256 _userId)
        public
        view
        returns (BookStoreUser memory)
    {
        for (uint256 userId = 0; userId < allBookStoreUsers.length; userId++) {
            BookStoreUser memory currentUser = allBookStoreUsers[userId];
            if (currentUser.id == _userId) {
                return currentUser;
            }
        }
        BookStoreUser memory blankUser;
        blankUser.isBlank = true;
        return blankUser;
    }

    
}

