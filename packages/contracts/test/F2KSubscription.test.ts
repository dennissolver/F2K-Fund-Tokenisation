import { expect } from "chai";
import { ethers } from "hardhat";
import { F2KSubscription, MockUSDC } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("F2KSubscription", function () {
  let subscription: F2KSubscription;
  let usdc: MockUSDC;
  let admin: SignerWithAddress;
  let treasury: SignerWithAddress;
  let investor: SignerWithAddress;
  let other: SignerWithAddress;

  const MILLION = 1_000_000;
  const MIN_SUB = 10_000 * MILLION; // 10,000 USDC

  beforeEach(async function () {
    [admin, treasury, investor, other] = await ethers.getSigners();

    const MockUSDCFactory = await ethers.getContractFactory("MockUSDC");
    usdc = await MockUSDCFactory.deploy();

    const SubFactory = await ethers.getContractFactory("F2KSubscription");
    subscription = await SubFactory.deploy(
      await usdc.getAddress(),
      treasury.address,
      MIN_SUB,
      admin.address
    );

    // Mint USDC to investor
    await usdc.mint(investor.address, 1_000_000 * MILLION);
    await usdc.connect(investor).approve(await subscription.getAddress(), 1_000_000 * MILLION);
  });

  it("Investor can subscribe with USDC", async function () {
    await subscription.connect(investor).subscribe(50_000 * MILLION);
    expect(await subscription.subscriptionCount()).to.equal(1);
    const sub = await subscription.subscriptions(0);
    expect(sub.investor).to.equal(investor.address);
    expect(sub.amount).to.equal(50_000 * MILLION);
    expect(sub.processed).to.equal(false);
  });

  it("Below minimum rejected", async function () {
    await expect(
      subscription.connect(investor).subscribe(5_000 * MILLION)
    ).to.be.revertedWith("Below minimum");
  });

  it("USDC forwarded to treasury", async function () {
    const amount = 50_000 * MILLION;
    const treasuryBefore = await usdc.balanceOf(treasury.address);
    await subscription.connect(investor).subscribe(amount);
    const treasuryAfter = await usdc.balanceOf(treasury.address);
    expect(treasuryAfter - treasuryBefore).to.equal(amount);
  });

  it("Subscription record created", async function () {
    await subscription.connect(investor).subscribe(MIN_SUB);
    const sub = await subscription.subscriptions(0);
    expect(sub.investor).to.equal(investor.address);
    expect(sub.amount).to.equal(MIN_SUB);
    expect(sub.timestamp).to.be.gt(0);
    expect(sub.processed).to.equal(false);
  });

  it("Manager can mark processed", async function () {
    await subscription.connect(investor).subscribe(MIN_SUB);
    await subscription.markProcessed(0);
    const sub = await subscription.subscriptions(0);
    expect(sub.processed).to.equal(true);
  });

  it("Double-process rejected", async function () {
    await subscription.connect(investor).subscribe(MIN_SUB);
    await subscription.markProcessed(0);
    await expect(subscription.markProcessed(0)).to.be.revertedWith(
      "Already processed"
    );
  });

  it("Non-manager cannot mark processed", async function () {
    await subscription.connect(investor).subscribe(MIN_SUB);
    await expect(
      subscription.connect(other).markProcessed(0)
    ).to.be.reverted;
  });

  it("Admin can update treasury", async function () {
    await subscription.setTreasury(other.address);
    expect(await subscription.treasury()).to.equal(other.address);
  });

  it("Admin can update minimum subscription", async function () {
    await subscription.setMinSubscription(5_000 * MILLION);
    expect(await subscription.minSubscription()).to.equal(5_000 * MILLION);
  });

  it("Cannot set zero treasury", async function () {
    await expect(
      subscription.setTreasury(ethers.ZeroAddress)
    ).to.be.revertedWith("Zero address");
  });

  it("Events emitted correctly", async function () {
    await expect(subscription.connect(investor).subscribe(MIN_SUB))
      .to.emit(subscription, "SubscriptionReceived")
      .withArgs(0, investor.address, MIN_SUB);

    await expect(subscription.markProcessed(0))
      .to.emit(subscription, "SubscriptionProcessed")
      .withArgs(0);
  });

  it("Investor subscriptions tracked", async function () {
    await subscription.connect(investor).subscribe(MIN_SUB);
    await subscription.connect(investor).subscribe(20_000 * MILLION);
    const subs = await subscription.getInvestorSubscriptions(investor.address);
    expect(subs.length).to.equal(2);
  });

  it("Invalid subscription ID rejected", async function () {
    await expect(subscription.markProcessed(99)).to.be.revertedWith(
      "Invalid ID"
    );
  });
});
