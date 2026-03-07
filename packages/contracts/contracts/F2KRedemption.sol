// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title F2KRedemption
 * @notice Handles token redemption — investor burns F2K-HT tokens, receives USDC back from treasury.
 *         Two-step process:
 *         1. Investor sends F2K-HT tokens to this contract (escrow)
 *         2. Manager approves: USDC sent from treasury to investor, escrowed tokens sent to treasury
 *            Manager rejects: escrowed tokens returned to investor
 */
contract F2KRedemption is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    IERC20 public immutable usdc;
    IERC20 public immutable token;
    address public treasury;

    struct Redemption {
        address investor;
        uint256 tokenAmount;
        uint256 usdcPayout;
        uint256 timestamp;
        bool processed;
        bool rejected;
    }

    Redemption[] public redemptions;
    mapping(address => uint256[]) public investorRedemptions;

    event RedemptionRequested(uint256 indexed id, address indexed investor, uint256 tokenAmount);
    event RedemptionApproved(uint256 indexed id, address indexed investor, uint256 usdcPayout);
    event RedemptionRejected(uint256 indexed id, address indexed investor, uint256 tokenAmount);
    event TreasuryUpdated(address newTreasury);

    constructor(address _usdc, address _token, address _treasury, address admin) {
        usdc = IERC20(_usdc);
        token = IERC20(_token);
        treasury = _treasury;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MANAGER_ROLE, admin);
    }

    /**
     * @notice Investor requests redemption by sending F2K-HT tokens to escrow.
     *         Must have approved this contract to spend tokenAmount.
     */
    function requestRedemption(uint256 tokenAmount) external nonReentrant {
        require(tokenAmount > 0, "Zero amount");

        token.safeTransferFrom(msg.sender, address(this), tokenAmount);

        uint256 redemptionId = redemptions.length;
        redemptions.push(Redemption({
            investor: msg.sender,
            tokenAmount: tokenAmount,
            usdcPayout: 0,
            timestamp: block.timestamp,
            processed: false,
            rejected: false
        }));
        investorRedemptions[msg.sender].push(redemptionId);

        emit RedemptionRequested(redemptionId, msg.sender, tokenAmount);
    }

    /**
     * @notice Manager approves redemption. USDC sent from treasury to investor,
     *         escrowed tokens sent to treasury (effective burn).
     * @param redemptionId The redemption to approve
     * @param usdcAmount The USDC payout amount (based on current NAV)
     */
    function approveRedemption(uint256 redemptionId, uint256 usdcAmount) external onlyRole(MANAGER_ROLE) nonReentrant {
        require(redemptionId < redemptions.length, "Invalid ID");
        Redemption storage r = redemptions[redemptionId];
        require(!r.processed, "Already processed");
        require(!r.rejected, "Already rejected");
        require(usdcAmount > 0, "Zero payout");

        r.processed = true;
        r.usdcPayout = usdcAmount;

        // Send USDC from treasury to investor
        usdc.safeTransferFrom(treasury, r.investor, usdcAmount);

        // Send escrowed tokens to treasury (effective burn)
        token.safeTransfer(treasury, r.tokenAmount);

        emit RedemptionApproved(redemptionId, r.investor, usdcAmount);
    }

    /**
     * @notice Manager rejects redemption. Escrowed tokens returned to investor.
     */
    function rejectRedemption(uint256 redemptionId) external onlyRole(MANAGER_ROLE) nonReentrant {
        require(redemptionId < redemptions.length, "Invalid ID");
        Redemption storage r = redemptions[redemptionId];
        require(!r.processed, "Already processed");
        require(!r.rejected, "Already rejected");

        r.rejected = true;

        // Return escrowed tokens to investor
        token.safeTransfer(r.investor, r.tokenAmount);

        emit RedemptionRejected(redemptionId, r.investor, r.tokenAmount);
    }

    function setTreasury(address _treasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_treasury != address(0), "Zero address");
        treasury = _treasury;
        emit TreasuryUpdated(_treasury);
    }

    function redemptionCount() external view returns (uint256) {
        return redemptions.length;
    }

    function getInvestorRedemptions(address investor) external view returns (uint256[] memory) {
        return investorRedemptions[investor];
    }
}
