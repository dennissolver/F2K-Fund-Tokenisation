# Module 4: Smart Contracts (Solidity)

## Goal
Deploy ERC-3643 token, custom distribution contract, NAV attestation contract, and subscription contract on Sepolia testnet. Full test suite.

## Dependencies
- Module 1 complete (Hardhat project scaffolded)
- Modules 2-3 complete (understand the full workflow these contracts serve)

## Learning Path (do this first)

### Week 1: Solidity Foundations
1. Complete CryptoZombies lessons 1-6 (cryptozombies.io)
2. Read: solidity-by-example.org — focus on: mapping, struct, events, modifiers, inheritance, interfaces
3. Read OpenZeppelin source: ERC20.sol, AccessControl.sol, Ownable.sol, ReentrancyGuard.sol
4. Exercise: write + deploy a basic ERC-20 token on Sepolia via Hardhat

### Week 2: ERC-3643
1. Clone: `git clone https://github.com/TokenySolutions/T-REX.git`
2. Read their docs: docs.tokeny.com
3. Understand the 6 core contracts:
   - **Token** (T-REX Token) — the ERC-3643 token itself
   - **IdentityRegistry** — maps wallets to ONCHAINID identities
   - **IdentityRegistryStorage** — persistent storage for identity data
   - **Compliance** — modular rules engine (country restrictions, investor limits)
   - **ClaimTopicsRegistry** — which claim topics are required
   - **TrustedIssuersRegistry** — which issuers can verify claims
4. Deploy T-REX on Sepolia using their scripts. Test: verified wallet can transfer, unverified cannot.

## Contracts to Build

All in `packages/contracts/contracts/`:

### 4.1 Deploy T-REX Suite (configure, not write from scratch)

Create `packages/contracts/scripts/deploy-trex.ts`:
```typescript
// 1. Deploy IdentityRegistryStorage
// 2. Deploy IdentityRegistry (linked to storage)
// 3. Deploy ClaimTopicsRegistry
// 4. Deploy TrustedIssuersRegistry
// 5. Deploy ModularCompliance with modules:
//    - CountryAllowModule (allow: AU only for MVP)
//    - MaxBalanceModule (optional: cap per investor)
// 6. Deploy Token (F2K-HT) linked to all above:
//    - name: "F2K Housing Token"
//    - symbol: "F2K-HT"
//    - decimals: 6
//    - compliance: address from step 5
//    - identityRegistry: address from step 2
// 7. Set deployer as Token Agent (can mint/burn)
// 8. Log all deployed addresses to deployments.json
```

Create `packages/contracts/deployments.json` (updated by deploy script):
```json
{
  "sepolia": {
    "token": "0x...",
    "identityRegistry": "0x...",
    "identityRegistryStorage": "0x...",
    "compliance": "0x...",
    "claimTopicsRegistry": "0x...",
    "trustedIssuersRegistry": "0x...",
    "navAttestation": "0x...",
    "distribution": "0x...",
    "subscription": "0x..."
  }
}
```

### 4.2 NAV Attestation Contract

`packages/contracts/contracts/F2KNavAttestation.sol`:
```solidity
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
```

### 4.3 Distribution Contract

`packages/contracts/contracts/F2KDistribution.sol`:
```solidity
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
```

### 4.4 Subscription Contract

`packages/contracts/contracts/F2KSubscription.sol`:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title F2KSubscription
 * @notice Accepts USDC subscriptions. Admin mints tokens separately via T-REX agent role.
 *         This is a two-step process:
 *         1. Investor sends USDC to this contract
 *         2. Admin verifies + mints F2K-HT tokens to investor via T-REX token agent
 *
 *         Why two-step: T-REX token minting requires agent role and identity verification.
 *         Keeping subscription receipt separate from minting is cleaner and more auditable.
 */
contract F2KSubscription is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    IERC20 public immutable usdc;
    address public treasury;           // multisig receiving funds
    uint256 public minSubscription;    // minimum USDC amount

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
```

## Test Files

Create comprehensive tests in `packages/contracts/test/`:

### `test/F2KNavAttestation.test.ts`
- ✓ Publisher can publish NAV
- ✓ Non-publisher cannot publish NAV
- ✓ NAV history is maintained
- ✓ Current NAV updates correctly
- ✓ Zero NAV rejected
- ✓ Events emitted correctly

### `test/F2KDistribution.test.ts`
- ✓ Distributor can execute distribution
- ✓ Non-distributor cannot execute
- ✓ Length mismatch rejected
- ✓ Empty distribution rejected
- ✓ Zero address rejected
- ✓ Zero amount rejected
- ✓ Correct amounts sent to each recipient
- ✓ Total USDC transferred matches sum
- ✓ Events emitted for each payment
- ✓ Reentrancy protection works
- ✓ Distribution with 50+ recipients (gas test)

### `test/F2KSubscription.test.ts`
- ✓ Investor can subscribe with USDC
- ✓ Below minimum rejected
- ✓ USDC forwarded to treasury
- ✓ Subscription record created
- ✓ Manager can mark processed
- ✓ Double-process rejected
- ✓ Non-manager cannot mark processed
- ✓ Admin can update treasury and minimum
- ✓ Events emitted correctly

## Hardhat Config

Update `packages/contracts/hardhat.config.ts`:
```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env.local" });

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
  },
};
export default config;
```

## Acceptance Criteria
- [ ] `npx hardhat compile` — all contracts compile without warnings
- [ ] `npx hardhat test` — all tests pass
- [ ] T-REX suite deployed on Sepolia (addresses in deployments.json)
- [ ] F2KNavAttestation deployed on Sepolia
- [ ] F2KDistribution deployed on Sepolia
- [ ] F2KSubscription deployed on Sepolia
- [ ] Manual test: publish NAV via Etherscan, read it back
- [ ] Manual test: distribute USDC to 3 test wallets
- [ ] Manual test: subscribe with test USDC, verify treasury received funds
- [ ] Contract ABIs exported to `packages/shared/src/abis/`

## Verification
```bash
cd packages/contracts
npx hardhat compile
npx hardhat test
npx hardhat test --grep "NAV"
npx hardhat test --grep "Distribution"
npx hardhat test --grep "Subscription"
# Gas report:
REPORT_GAS=true npx hardhat test
```
