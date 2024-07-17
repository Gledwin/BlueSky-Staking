// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import {IERC20} from "./stakingIERC20.sol";
import {SafeMath} from "./mathSafe.sol";


contract Staking  {
    using SafeMath for uint256;
    IERC20 public s_stakingToken;
    IERC20 public s_rewardToken;

    IERC20 cUSD = IERC20(0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1);


    uint public constant REWARD_RATE = 1e18;
    uint private totalStakedTokens;
    uint public rewardPerTokenStored;
    uint public lastUpdateTime;

    mapping(address => uint) public stakedBalance;
    mapping(address => uint) public rewards;
    mapping(address => uint) public userRewardPerTokenPaid;

    event Staked(address indexed user, uint256 indexed amount);
    event Withdrawn(address indexed user, uint256 indexed amount);
    event RewardsClaimed(address indexed user, uint256 indexed amount);

    constructor(address stakingToken, address rewardToken) {
        s_stakingToken = IERC20(stakingToken);
        s_rewardToken = IERC20(rewardToken);
    }

    function rewardPerToken() public view returns (uint) {
        if (totalStakedTokens == 0) {
            return rewardPerTokenStored;
        }
        uint totalTime = block.timestamp - lastUpdateTime;
        uint totalRewards = REWARD_RATE * totalTime;
        return rewardPerTokenStored.add(totalRewards.mul(1e18).div(totalStakedTokens));
    }

    function earned(address account) public view returns (uint) {
        return (stakedBalance[account].mul(rewardPerToken().sub(userRewardPerTokenPaid[account])).div(1e18).add(rewards[account]));
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        rewards[account] = earned(account);
        userRewardPerTokenPaid[account] = rewardPerTokenStored;
        _;
    }

    function stake(uint amount) external updateReward(msg.sender) {
        require(amount > 0, "Amount must be greater than zero");
        totalStakedTokens += amount;
        stakedBalance[msg.sender] += amount;
        emit Staked(msg.sender, amount);

        bool success = s_stakingToken.transferFrom(msg.sender, address(this), amount);
        require(success, "Transfer of staking token failed");
    }

    function withdraw(uint amount) external  updateReward(msg.sender) {
        require(amount > 0, "Amount must be greater than zero");
        require(stakedBalance[msg.sender] >= amount, "Staked amount not enough");
        totalStakedTokens -= amount;
        stakedBalance[msg.sender] -= amount;
        emit Withdrawn(msg.sender, amount);

        bool success = s_stakingToken.transfer(msg.sender, amount);
        require(success, "Transfer of staking token failed");
    }

    function getReward() external updateReward(msg.sender) {
        uint reward = rewards[msg.sender];
        require(reward > 0, "No rewards to claim");
        rewards[msg.sender] = 0;
        emit RewardsClaimed(msg.sender, reward);

        bool success = s_rewardToken.transfer(msg.sender, reward);
        require(success, "Transfer of reward token failed");
    }
}

//0x6af73f936f399745acd9c2feed13e773c6e51bd3 stake
// 0xf63419017e7e28e6baf65838a63c34d837e72741 reward
// staking- 0x38c7e0de4af28ff3ca7d5d2f9ea7f203b5778c12