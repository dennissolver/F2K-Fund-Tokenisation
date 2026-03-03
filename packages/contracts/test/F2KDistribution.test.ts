import { expect } from "chai";
import { ethers } from "hardhat";
import { F2KDistribution, MockUSDC } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("F2KDistribution", function () {
  let distribution: F2KDistribution;
  let usdc: MockUSDC;
  let admin: SignerWithAddress;
  let other: SignerWithAddress;
  let recipient1: SignerWithAddress;
  let recipient2: SignerWithAddress;
  let recipient3: SignerWithAddress;

  const MILLION = 1_000_000; // 1 USDC (6 decimals)

  beforeEach(async function () {
    [admin, other, recipient1, recipient2, recipient3] = await ethers.getSigners();

    const MockUSDCFactory = await ethers.getContractFactory("MockUSDC");
    usdc = await MockUSDCFactory.deploy();

    const DistFactory = await ethers.getContractFactory("F2KDistribution");
    distribution = await DistFactory.deploy(await usdc.getAddress(), admin.address);

    // Mint USDC to admin for distributions
    await usdc.mint(admin.address, 100_000 * MILLION);
    await usdc.approve(await distribution.getAddress(), 100_000 * MILLION);
  });

  it("Distributor can execute distribution", async function () {
    await distribution.distribute(
      [recipient1.address, recipient2.address],
      [1000 * MILLION, 2000 * MILLION]
    );
    expect(await usdc.balanceOf(recipient1.address)).to.equal(1000 * MILLION);
    expect(await usdc.balanceOf(recipient2.address)).to.equal(2000 * MILLION);
  });

  it("Non-distributor cannot execute", async function () {
    await expect(
      distribution.connect(other).distribute(
        [recipient1.address],
        [1000 * MILLION]
      )
    ).to.be.reverted;
  });

  it("Length mismatch rejected", async function () {
    await expect(
      distribution.distribute(
        [recipient1.address, recipient2.address],
        [1000 * MILLION]
      )
    ).to.be.revertedWith("Length mismatch");
  });

  it("Empty distribution rejected", async function () {
    await expect(distribution.distribute([], [])).to.be.revertedWith(
      "Empty distribution"
    );
  });

  it("Zero address rejected", async function () {
    await expect(
      distribution.distribute(
        [ethers.ZeroAddress],
        [1000 * MILLION]
      )
    ).to.be.revertedWith("Zero address");
  });

  it("Zero amount rejected", async function () {
    await expect(
      distribution.distribute([recipient1.address], [0])
    ).to.be.revertedWith("Zero amount");
  });

  it("Correct amounts sent to each recipient", async function () {
    await distribution.distribute(
      [recipient1.address, recipient2.address, recipient3.address],
      [500 * MILLION, 300 * MILLION, 200 * MILLION]
    );
    expect(await usdc.balanceOf(recipient1.address)).to.equal(500 * MILLION);
    expect(await usdc.balanceOf(recipient2.address)).to.equal(300 * MILLION);
    expect(await usdc.balanceOf(recipient3.address)).to.equal(200 * MILLION);
  });

  it("Total USDC transferred matches sum", async function () {
    const balBefore = await usdc.balanceOf(admin.address);
    await distribution.distribute(
      [recipient1.address, recipient2.address],
      [1000 * MILLION, 2000 * MILLION]
    );
    const balAfter = await usdc.balanceOf(admin.address);
    expect(balBefore - balAfter).to.equal(3000 * MILLION);
  });

  it("Events emitted for each payment", async function () {
    await expect(
      distribution.distribute(
        [recipient1.address, recipient2.address],
        [1000 * MILLION, 500 * MILLION]
      )
    )
      .to.emit(distribution, "PaymentSent")
      .withArgs(0, recipient1.address, 1000 * MILLION)
      .and.to.emit(distribution, "PaymentSent")
      .withArgs(0, recipient2.address, 500 * MILLION)
      .and.to.emit(distribution, "DistributionCompleted")
      .withArgs(0);
  });

  it("Distribution count increments", async function () {
    expect(await distribution.distributionCount()).to.equal(0);
    await distribution.distribute([recipient1.address], [100 * MILLION]);
    expect(await distribution.distributionCount()).to.equal(1);
  });
});
