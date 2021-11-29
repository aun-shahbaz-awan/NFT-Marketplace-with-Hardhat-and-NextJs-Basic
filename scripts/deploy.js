const hre = require("hardhat");
const fs = require('fs');

async function main() {
  // Deploying NFT Market Contract
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const market = await NFTMarket.deploy();
  await market.deployed();
  console.log("NFT Market deployed to:", market.address);
  // Deploying NFT Contract
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(market.address); 
  await nft.deployed();
  console.log("NFT deployed to:", nft.address);
  // Getting Market & NFT Contract Addresses
  let config = `
  export const MarketAddress = "${market.address}"
  export const NFTAddress = "${nft.address}"
  `
  // Generating 'config.js' file that contain NFT Market & NFT  Addresses
  let data = JSON.stringify(config)
  fs.writeFileSync('config.js', JSON.parse(data))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });