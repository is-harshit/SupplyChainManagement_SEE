// const ethers = require("ethers");
// const fs = require("fs-extra");

import { ethers } from "ethers";
import { fs } from "fs-extra"

var contract;

async function connect() {
  console.log(window.ethereum);
  if (!window.ethereum) {
    alert("Get MetaMask -> https://metamask.io/");
  } else {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        initialise();
      } catch (error) {
        console.log("error:" + error);
      }
    }
  }
}

async function initialise() {
  contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const abi = fs.readFileSync("./PeopleProfile_sol_PeopleProfile.abi", "utf8");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  contract = new ethers.Contract(contractAddress, abi, signer);

  var x = document.getElementById("functions");
  x.style.display = "block";
}

async function store(age) {
  contract.store(age);
}

async function retrieve() {
  var age = contract.retrieve();
  document.getElementById("Display").innerHTML = "Retrieved age is: " + age;
}

async function getABI() {
  const response = await fetch(
    "/home/harshit/BlockChain/PeopleProfile_sol_PeopleProfile.abi"
  );
  return response.json();
}
