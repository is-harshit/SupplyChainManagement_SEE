import React, { useState } from "react";
import { ethers } from "ethers";

// import contractAbi from "./PeopleProfile_sol_PeopleProfile.abi";
import contractBin from "./PeopleProfile_sol_PeopleProfile.bin";
import contractAbi from "./PeopleProfile.json" ;

import "./App.css";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [age, setAge] = useState(0);
  const [inputAge, setInputAge] = useState("");

  const CONTRACT_ADDRESS = "0x73C09056db9cb961be93c2a2008194A269600A8d";

  async function connect() {
    if (!window.ethereum) {
      alert("Get MetaMask -> https://metamask.io/");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        initialise();
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  }

  async function initialise() {
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      console.log(currentAccount);

      // const contractFactory = new ethers.ContractFactory(contractAbi, contractBin, signer);

      // const contract = await contractFactory.deploy();

      // await contract.deployed();

      // console.log("Contract deployed to:", contract.address);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
      setContract(contract);
    } catch (error) {
      console.error("Error initializing the contract:", error);
    }
  }

  async function store() {
    if (!contract) {
      console.error("Contract not initialized");
      initialise();
      return;
    }
    const ageToStore = parseInt(inputAge, 10);

    if (!isNaN(ageToStore)) {
      await contract.store(ageToStore);
      setInputAge("");
    } else {
      console.error("Invalid age entered");
    }
  }

  async function retrieve() {
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }
    const retrievedAge = await contract.retrieve();
    setAge(parseInt(retrievedAge, 10)); // Ensure the retrieved age is treated as a number
  }

  return (
    <div className="App">
      <header className="App-header">
        {currentAccount ? (
          <>
            <div>Connected Account: {currentAccount}</div>
            <br></br>
            <div>Connected Contract: {CONTRACT_ADDRESS}</div>
            <input
              type="number"
              value={inputAge}
              onChange={(e) => setInputAge(e.target.value)}
              placeholder="Enter your age"
            />
            <button onClick={store}>Store Age</button>
            <button onClick={retrieve}>Retrieve Age</button>
            {age !== 0 && <div>Age: {age}</div>}
          </>
        ) : (
          <button onClick={connect}>Connect Wallet</button>
        )}
      </header>
    </div>
  );
}

export default App;
