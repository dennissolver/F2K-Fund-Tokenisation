import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // Use Sepolia USDC or deploy MockUSDC for testing
  const USDC_ADDRESS = process.env.USDC_ADDRESS;
  let usdcAddress: string;

  if (USDC_ADDRESS) {
    usdcAddress = USDC_ADDRESS;
    console.log("Using existing USDC at:", usdcAddress);
  } else {
    console.log("Deploying MockUSDC...");
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const mockUsdc = await MockUSDC.deploy();
    await mockUsdc.waitForDeployment();
    usdcAddress = await mockUsdc.getAddress();
    console.log("MockUSDC deployed to:", usdcAddress);
  }

  // Deploy F2KSubscription
  console.log("Deploying F2KSubscription...");
  const minSubscription = 10_000n * 1_000_000n; // 10,000 USDC (6 decimals)
  const treasury = deployer.address; // Use deployer as treasury for now
  const SubFactory = await ethers.getContractFactory("F2KSubscription");
  const subscription = await SubFactory.deploy(usdcAddress, treasury, minSubscription, deployer.address);
  await subscription.waitForDeployment();
  const subscriptionAddress = await subscription.getAddress();
  console.log("F2KSubscription deployed to:", subscriptionAddress);

  // Deploy F2KNavAttestation
  console.log("Deploying F2KNavAttestation...");
  const NavFactory = await ethers.getContractFactory("F2KNavAttestation");
  const nav = await NavFactory.deploy(deployer.address);
  await nav.waitForDeployment();
  const navAddress = await nav.getAddress();
  console.log("F2KNavAttestation deployed to:", navAddress);

  // Deploy F2KDistribution
  console.log("Deploying F2KDistribution...");
  const DistFactory = await ethers.getContractFactory("F2KDistribution");
  const distribution = await DistFactory.deploy(usdcAddress, deployer.address);
  await distribution.waitForDeployment();
  const distributionAddress = await distribution.getAddress();
  console.log("F2KDistribution deployed to:", distributionAddress);

  // Deploy F2KRedemption
  const tokenAddress = process.env.TOKEN_ADDRESS ?? "0x0000000000000000000000000000000000000000";
  console.log("Deploying F2KRedemption...");
  const RedemptionFactory = await ethers.getContractFactory("F2KRedemption");
  const redemption = await RedemptionFactory.deploy(usdcAddress, tokenAddress, deployer.address, deployer.address);
  await redemption.waitForDeployment();
  const redemptionAddress = await redemption.getAddress();
  console.log("F2KRedemption deployed to:", redemptionAddress);

  // Deploy F2KMarketplace
  const feeBps = 50; // 0.50%
  console.log("Deploying F2KMarketplace...");
  const MarketplaceFactory = await ethers.getContractFactory("F2KMarketplace");
  const marketplace = await MarketplaceFactory.deploy(usdcAddress, tokenAddress, feeBps, deployer.address, deployer.address);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("F2KMarketplace deployed to:", marketplaceAddress);

  // Save deployment addresses
  const deployments = {
    sepolia: {
      token: tokenAddress,
      navAttestation: navAddress,
      distribution: distributionAddress,
      subscription: subscriptionAddress,
      redemption: redemptionAddress,
      marketplace: marketplaceAddress,
      usdc: usdcAddress,
      identityRegistry: "0x0000000000000000000000000000000000000000",
    },
  };

  const deploymentsPath = path.join(__dirname, "..", "deployments.json");
  fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
  console.log("\nDeployment addresses saved to deployments.json");

  console.log("\n--- Summary ---");
  console.log(`USDC:            ${usdcAddress}`);
  console.log(`Subscription:    ${subscriptionAddress}`);
  console.log(`NAV Attestation: ${navAddress}`);
  console.log(`Distribution:    ${distributionAddress}`);
  console.log(`Redemption:      ${redemptionAddress}`);
  console.log(`Marketplace:     ${marketplaceAddress}`);
  console.log("\nAdd these to your .env.local:");
  console.log(`NEXT_PUBLIC_USDC_ADDRESS=${usdcAddress}`);
  console.log(`NEXT_PUBLIC_SUBSCRIPTION_ADDRESS=${subscriptionAddress}`);
  console.log(`NEXT_PUBLIC_NAV_ADDRESS=${navAddress}`);
  console.log(`NEXT_PUBLIC_DISTRIBUTION_ADDRESS=${distributionAddress}`);
  console.log(`NEXT_PUBLIC_REDEMPTION_ADDRESS=${redemptionAddress}`);
  console.log(`NEXT_PUBLIC_MARKETPLACE_ADDRESS=${marketplaceAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
