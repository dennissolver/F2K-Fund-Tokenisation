// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title F2KSubscription
 * @notice Accepts USDC subscriptions. Admin mints tokens separately via T-REX agent role.
 *         Two-step process:
 *         1. Investor sends USDC to this contract (forwarded to treasury)
 *         2. Admin verifies + mints F2K-HT tokens to investor via T-REX token agent
 */
contract F2KSubscription is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    IERC20 public immutable usdc;
    address public treasury;
    uint256 public minSubscription;

    struct Subscription {
        address investor;
        uint256 amount;
        uint256 timestamp;
        bool processed;
    }

    Subscription[] public subscriptions;
    mapping(address => uint256[]) public investorSubscriptions;

    event SubscriptionReceived(uint256 indexed id, address indexed investor, uint256 amount);
    event SubscriptionProcessed(uint256 indexed id);
    event TreasuryUpdated(address newTreasury);
    event MinSubscriptionUpdated(uint256 newMin);

    constructor(address _usdc, address _treasury, uint256 _minSubscription, address admin) {
        usdc = IERC20(_usdc);
        treasury = _treasury;
        minSubscription = _minSubscription;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MANAGER_ROLE, admin);
    }

    /**
     * @notice Investor subscribes by sending USDC. Must have approved this contract.
     */
    function subscribe(uint256 amount) external nonReentrant {
        require(amount >= minSubscription, "Below minimum");

        usdc.safeTransferFrom(msg.sender, treasury, amount);

        uint256 subId = subscriptions.length;
        subscriptions.push(Subscription({
            investor: msg.sender,
            amount: amount,
            timestamp: block.timestamp,
            processed: false
        }));
        investorSubscriptions[msg.sender].push(subId);

        emit SubscriptionReceived(subId, msg.sender, amount);
    }

    /**
     * @notice Admin marks subscription as processed (tokens minted via T-REX separately)
     */
    function markProcessed(uint256 subId) external onlyRole(MANAGER_ROLE) {
        require(subId < subscriptions.length, "Invalid ID");
        require(!subscriptions[subId].processed, "Already processed");
        subscriptions[subId].processed = true;
        emit SubscriptionProcessed(subId);
    }

    function setTreasury(address _treasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_treasury != address(0), "Zero address");
        treasury = _treasury;
        emit TreasuryUpdated(_treasury);
    }

    function setMinSubscription(uint256 _min) external onlyRole(DEFAULT_ADMIN_ROLE) {
        minSubscription = _min;
        emit MinSubscriptionUpdated(_min);
    }

    function subscriptionCount() external view returns (uint256) {
        return subscriptions.length;
    }

    function getInvestorSubscriptions(address investor) external view returns (uint256[] memory) {
        return investorSubscriptions[investor];
    }
}
