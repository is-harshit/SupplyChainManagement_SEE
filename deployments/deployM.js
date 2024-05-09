const ethers = require("ethers");
const fs = require("fs-extra");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-sepolia.g.alchemy.com/v2/e8VHvbM96AK3lqRXzQdmcxwMTlo6klps"
  );

  const wallet = new ethers.Wallet(
    "b744fb9ed6746f7503b4a7c1d830fa6e68f4ebee6e49b8087baec9221459c9c3",
    provider
  );

  const abi = fs.readFileSync(
    "./SCM_sol_SupplyChainManagement.abi",
    "utf8"
  );
  const binary = fs.readFileSync(
    "./SCM_sol_SupplyChainManagement.bin",
    "utf8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Contract is deploying...");

  const contract = await contractFactory.deploy(2,3);
  console.log(contract);
  console.log("Contract deployed! 🥂🥂");
  console.log("Contract deployed at address: " + contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
