// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title F2KNavAttestation
 * @notice Stores weekly NAV attestations for the F2K Housing Token fund.
 *         Only authorised publishers (multisig/admin) can submit.
 *         Anyone can read current and historical NAV.
 */
contract F2KNavAttestation is AccessControl {
    bytes32 public constant PUBLISHER_ROLE = keccak256("PUBLISHER_ROLE");

    struct NavRecord {
        uint256 navPerToken;    // 6 decimals (matching USDC)
        uint256 totalNav;       // 6 decimals
        uint256 totalSupply;    // 6 decimals
        uint256 timestamp;
        address publisher;
    }

    NavRecord public currentNav;
    NavRecord[] public navHistory;

    event NavPublished(
        uint256 indexed recordIndex,
        uint256 navPerToken,
        uint256 totalNav,
        uint256 totalSupply,
        uint256 timestamp,
        address publisher
    );

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PUBLISHER_ROLE, admin);
    }

    function publishNav(
        uint256 _navPerToken,
        uint256 _totalNav,
        uint256 _totalSupply
    ) external onlyRole(PUBLISHER_ROLE) {
        require(_navPerToken > 0, "NAV must be positive");
        require(_totalSupply > 0, "Supply must be positive");

        NavRecord memory record = NavRecord({
            navPerToken: _navPerToken,
            totalNav: _totalNav,
            totalSupply: _totalSupply,
            timestamp: block.timestamp,
            publisher: msg.sender
        });

        currentNav = record;
        navHistory.push(record);

        emit NavPublished(
            navHistory.length - 1,
            _navPerToken,
            _totalNav,
            _totalSupply,
            block.timestamp,
            msg.sender
        );
    }

    function getNavHistory() external view returns (NavRecord[] memory) {
        return navHistory;
    }

    function getNavAt(uint256 index) external view returns (NavRecord memory) {
        require(index < navHistory.length, "Index out of bounds");
        return navHistory[index];
    }

    function historyLength() external view returns (uint256) {
        return navHistory.length;
    }
}
