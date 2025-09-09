import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia.publicnode.com",
      accounts: ["920e6c156bfa96c03ef86385df1e1a2bf0eaa45d370d58b6f4d89c0fb2e54714"],
      chainId: 11155111,
    },
    hardhat: {
      chainId: 1337,
    },
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
};

export default config;
