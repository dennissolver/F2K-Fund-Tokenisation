// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title F2KDistribution
 * @notice Distributes USDC to F2K-HT holders pro-rata.
 *         Admin submits list of (address, amount) pairs.
 *         Contract verifies total matches approved amount, then distributes.
 */
contract F2KDistribution is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");

    IERC20 public immutable usdc;

    struct Distribution {
        uint256 totalAmount;
        uint256 recipientCount;
        uint256 timestamp;
        bool executed;
    }

    Distribution[] public distributions;

    event DistributionCreated(uint256 indexed id, uint256 totalAmount, uint256 recipientCount);
    event PaymentSent(uint256 indexed distributionId, address indexed recipient, uint256 amount);
    event DistributionCompleted(uint256 indexed id);

    constructor(address _usdc, address admin) {
        usdc = IERC20(_usdc);
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(DISTRIBUTOR_ROLE, admin);
    }

    /**
     * @notice Execute a distribution. Caller must have approved USDC spend.
     * @param recipients Array of recipient addresses
     * @param amounts Array of USDC amounts (must match recipients length)
     */
    function distribute(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyRole(DISTRIBUTOR_ROLE) nonReentrant {
        require(recipients.length == amounts.length, "Length mismatch");
        require(recipients.length > 0, "Empty distribution");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            require(recipients[i] != address(0), "Zero address");
            require(amounts[i] > 0, "Zero amount");
            totalAmount += amounts[i];
        }

        // Transfer total USDC from caller to this contract
        usdc.safeTransferFrom(msg.sender, address(this), totalAmount);

        uint256 distId = distributions.length;
        distributions.push(Distribution({
            totalAmount: totalAmount,
            recipientCount: recipients.length,
            timestamp: block.timestamp,
            executed: false
        }));

        emit DistributionCreated(distId, totalAmount, recipients.length);

        // Distribute to each recipient
        for (uint256 i = 0; i < recipients.length; i++) {
            usdc.safeTransfer(recipients[i], amounts[i]);
            emit PaymentSent(distId, recipients[i], amounts[i]);
        }

        distributions[distId].executed = true;
        emit DistributionCompleted(distId);
    }

    function distributionCount() external view returns (uint256) {
        return distributions.length;
    }
}
