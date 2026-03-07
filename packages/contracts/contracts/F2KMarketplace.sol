// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title F2KMarketplace
 * @notice Peer-to-peer marketplace where allowlisted investors can list F2K-HT tokens
 *         for sale and other allowlisted investors can buy them.
 *         Tokens are escrowed in the contract on listing; USDC payment on purchase.
 *         Platform fee deducted from USDC payment before forwarding to seller.
 */
contract F2KMarketplace is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    IERC20 public immutable usdc;
    IERC20 public immutable token;
    uint256 public feeBps;
    address public feeRecipient;

    struct Listing {
        address seller;
        address buyer;
        uint256 tokenAmount;
        uint256 pricePerToken;
        uint256 totalPrice;
        uint256 timestamp;
        bool filled;
        bool cancelled;
    }

    Listing[] public listings;
    mapping(address => uint256[]) public sellerListings;

    event ListingCreated(uint256 indexed id, address indexed seller, uint256 tokenAmount, uint256 pricePerToken, uint256 totalPrice);
    event ListingFilled(uint256 indexed id, address indexed buyer, uint256 totalPrice, uint256 fee);
    event ListingCancelled(uint256 indexed id, address indexed seller);
    event FeeBpsUpdated(uint256 newFeeBps);
    event FeeRecipientUpdated(address newFeeRecipient);

    constructor(address _usdc, address _token, uint256 _feeBps, address _feeRecipient, address admin) {
        require(_feeBps <= 10000, "Fee exceeds 100%");
        require(_feeRecipient != address(0), "Zero address");

        usdc = IERC20(_usdc);
        token = IERC20(_token);
        feeBps = _feeBps;
        feeRecipient = _feeRecipient;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MANAGER_ROLE, admin);
    }

    /**
     * @notice Seller creates a listing by escrowing F2K-HT tokens.
     *         Must have approved this contract to spend tokenAmount.
     * @param tokenAmount Number of tokens to sell
     * @param pricePerToken USDC price per token (in USDC decimals)
     */
    function createListing(uint256 tokenAmount, uint256 pricePerToken) external nonReentrant {
        require(tokenAmount > 0, "Zero amount");
        require(pricePerToken > 0, "Zero price");

        uint256 totalPrice = tokenAmount * pricePerToken / 1e18;
        require(totalPrice > 0, "Total price zero");

        token.safeTransferFrom(msg.sender, address(this), tokenAmount);

        uint256 listingId = listings.length;
        listings.push(Listing({
            seller: msg.sender,
            buyer: address(0),
            tokenAmount: tokenAmount,
            pricePerToken: pricePerToken,
            totalPrice: totalPrice,
            timestamp: block.timestamp,
            filled: false,
            cancelled: false
        }));
        sellerListings[msg.sender].push(listingId);

        emit ListingCreated(listingId, msg.sender, tokenAmount, pricePerToken, totalPrice);
    }

    /**
     * @notice Buyer purchases a listing. Must have approved USDC spend.
     *         USDC goes to seller (minus fee). F2K-HT released from escrow to buyer.
     */
    function buyListing(uint256 listingId) external nonReentrant {
        require(listingId < listings.length, "Invalid ID");
        Listing storage l = listings[listingId];
        require(!l.filled, "Already filled");
        require(!l.cancelled, "Already cancelled");
        require(msg.sender != l.seller, "Cannot buy own listing");

        l.filled = true;
        l.buyer = msg.sender;

        uint256 fee = l.totalPrice * feeBps / 10000;
        uint256 sellerProceeds = l.totalPrice - fee;

        // Collect USDC from buyer
        usdc.safeTransferFrom(msg.sender, address(this), l.totalPrice);

        // Send proceeds to seller
        usdc.safeTransfer(l.seller, sellerProceeds);

        // Send fee to feeRecipient
        if (fee > 0) {
            usdc.safeTransfer(feeRecipient, fee);
        }

        // Release escrowed tokens to buyer
        token.safeTransfer(msg.sender, l.tokenAmount);

        emit ListingFilled(listingId, msg.sender, l.totalPrice, fee);
    }

    /**
     * @notice Seller cancels their own listing. Returns escrowed tokens.
     */
    function cancelListing(uint256 listingId) external nonReentrant {
        require(listingId < listings.length, "Invalid ID");
        Listing storage l = listings[listingId];
        require(msg.sender == l.seller, "Not seller");
        require(!l.filled, "Already filled");
        require(!l.cancelled, "Already cancelled");

        l.cancelled = true;

        token.safeTransfer(l.seller, l.tokenAmount);

        emit ListingCancelled(listingId, l.seller);
    }

    /**
     * @notice Manager emergency-cancels a listing. Returns escrowed tokens to seller.
     */
    function emergencyCancel(uint256 listingId) external onlyRole(MANAGER_ROLE) nonReentrant {
        require(listingId < listings.length, "Invalid ID");
        Listing storage l = listings[listingId];
        require(!l.filled, "Already filled");
        require(!l.cancelled, "Already cancelled");

        l.cancelled = true;

        token.safeTransfer(l.seller, l.tokenAmount);

        emit ListingCancelled(listingId, l.seller);
    }

    function setFeeBps(uint256 _feeBps) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_feeBps <= 10000, "Fee exceeds 100%");
        feeBps = _feeBps;
        emit FeeBpsUpdated(_feeBps);
    }

    function setFeeRecipient(address _feeRecipient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_feeRecipient != address(0), "Zero address");
        feeRecipient = _feeRecipient;
        emit FeeRecipientUpdated(_feeRecipient);
    }

    function listingCount() external view returns (uint256) {
        return listings.length;
    }

    /**
     * @notice Returns IDs of all active (not filled, not cancelled) listings.
     */
    function getActiveListings() external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < listings.length; i++) {
            if (!listings[i].filled && !listings[i].cancelled) {
                count++;
            }
        }

        uint256[] memory activeIds = new uint256[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < listings.length; i++) {
            if (!listings[i].filled && !listings[i].cancelled) {
                activeIds[idx] = i;
                idx++;
            }
        }

        return activeIds;
    }

    function getSellerListings(address seller) external view returns (uint256[] memory) {
        return sellerListings[seller];
    }
}
