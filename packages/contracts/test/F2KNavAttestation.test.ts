import { expect } from "chai";
import { ethers } from "hardhat";
import { F2KNavAttestation } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("F2KNavAttestation", function () {
  let nav: F2KNavAttestation;
  let admin: SignerWithAddress;
  let other: SignerWithAddress;

  beforeEach(async function () {
    [admin, other] = await ethers.getSigners();
    const NavFactory = await ethers.getContractFactory("F2KNavAttestation");
    nav = await NavFactory.deploy(admin.address);
  });

  it("Publisher can publish NAV", async function () {
    await nav.publishNav(1_050_000, 10_500_000_000, 10_000_000_000);
    const current = await nav.currentNav();
    expect(current.navPerToken).to.equal(1_050_000);
    expect(current.totalNav).to.equal(10_500_000_000);
    expect(current.totalSupply).to.equal(10_000_000_000);
  });

  it("Non-publisher cannot publish NAV", async function () {
    await expect(
      nav.connect(other).publishNav(1_000_000, 10_000_000_000, 10_000_000_000)
    ).to.be.reverted;
  });

  it("NAV history is maintained", async function () {
    await nav.publishNav(1_000_000, 10_000_000_000, 10_000_000_000);
    await nav.publishNav(1_050_000, 10_500_000_000, 10_000_000_000);
    expect(await nav.historyLength()).to.equal(2);

    const first = await nav.getNavAt(0);
    expect(first.navPerToken).to.equal(1_000_000);

    const second = await nav.getNavAt(1);
    expect(second.navPerToken).to.equal(1_050_000);
  });

  it("Current NAV updates correctly", async function () {
    await nav.publishNav(1_000_000, 10_000_000_000, 10_000_000_000);
    await nav.publishNav(1_100_000, 11_000_000_000, 10_000_000_000);
    const current = await nav.currentNav();
    expect(current.navPerToken).to.equal(1_100_000);
  });

  it("Zero NAV rejected", async function () {
    await expect(
      nav.publishNav(0, 10_000_000_000, 10_000_000_000)
    ).to.be.revertedWith("NAV must be positive");
  });

  it("Zero supply rejected", async function () {
    await expect(
      nav.publishNav(1_000_000, 10_000_000_000, 0)
    ).to.be.revertedWith("Supply must be positive");
  });

  it("Events emitted correctly", async function () {
    await expect(nav.publishNav(1_000_000, 10_000_000_000, 10_000_000_000))
      .to.emit(nav, "NavPublished")
      .withArgs(0, 1_000_000, 10_000_000_000, 10_000_000_000, await getBlockTimestamp(), admin.address);
  });

  it("Index out of bounds rejected", async function () {
    await expect(nav.getNavAt(0)).to.be.revertedWith("Index out of bounds");
  });

  it("getNavHistory returns all records", async function () {
    await nav.publishNav(1_000_000, 10_000_000_000, 10_000_000_000);
    await nav.publishNav(1_050_000, 10_500_000_000, 10_000_000_000);
    const history = await nav.getNavHistory();
    expect(history.length).to.equal(2);
  });
});

async function getBlockTimestamp(): Promise<number> {
  const block = await ethers.provider.getBlock("latest");
  return block!.timestamp;
}
