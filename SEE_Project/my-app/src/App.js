import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import contractAbi from "./SupplyChainManagement.json";

import BankcontractAbi from "./Bank.json";

import "./App.css";

function App() {
  // const [owner, setOwner] = useState("");
  let owner = "0x098ebe4832Dc94241d859680E6C98c708593c7e1";
  const [currentAccount, setCurrentAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [bankContract, setBankContract] = useState(null);
  const [InvestAmount, setInvestAmount] = useState(0);
  const [funds, setFunds] = useState(null);
  const [PurchaseBank, setPurchaseBank] = useState(0);
  const [Stocks, setStocks] = useState(null);
  const [BuyStock, setBuyStock] = useState(0);
  const [newowner, setnewowner] = useState("");

  const [error, SetError] = useState(false);
  const [errormsg, setErrormsg] = useState(false);
  const [IllegalError, SetIllegalError] = useState(false);

  const buyPricePerstockFromBank = 2;
  const sellPricePerstockFromBank = buyPricePerstockFromBank / 2;
  const CompanySellPrice = 3;

  const CONTRACT_ADDRESS = "0x8f3A15DEC956d7e35323fB50B24D3ec50D95d4d7";
  const BankContractAddress = "0xFd4Ac8ac504D3B3C1F0Ca5068BbA30CF323A594e";

  const etherify = (wei) => {
    return 0.000000000000000001 * wei;
  };

  // useEffect(() => {
  //   currentFunds();
  //   Stockinventory();
  // }, [currentAccount]);

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

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractAbi.abi,
        signer
      );
      setContract(contract);

      const BankContract = new ethers.Contract(
        BankContractAddress,
        BankcontractAbi.abi,
        signer
      );
      setBankContract(BankContract);

      // let own = await contract.owner();
      // own = parseInt(own, 16);
      // console.log("Owner of contract is: ", own);

      // setOwner(own);
    } catch (error) {
      console.error("Error initializing the contract:", error);
    }
  }

  const Stockinventory = async () => {
    SetError(false);
    try {
      let inven = await contract.Stockinventory();
      inven = parseInt(inven, 16);
      console.log(inven);
      setStocks(inven);
    } catch (e) {
      console.log(e);
      if (e.toString().includes("Not the Owner")) {
        SetError(true);
        setErrormsg("you are not the owner");
      }
    }
  };

  const currentFunds = async () => {
    SetError(false);
    try {
      let Funds = await contract.currentFunds();
      // Funds=Funds.toString();
      Funds = parseInt(Funds._hex, 16);
      console.log(Funds);
      setFunds(Funds);
    } catch (e) {
      console.log(e);
      if (e.toString().includes("Not the Owner")) {
        SetError(true);
        setErrormsg("you are not the owner");
      }
    }
  };

  const Invest = async () => {
    SetError(false);

    if (InvestAmount > 0) {
      let amount = etherify(InvestAmount);
      console.log("Invest Called: " + InvestAmount);
      try {
        let tx = await contract.Invest(InvestAmount, {
          value: InvestAmount.toString(),
        });
        await tx.wait();
      } catch (e) {
        console.log(e);
        if (e.toString().includes(" rejected transaction")) {
          SetError(true);
          setErrormsg("the transaction is rejected");
        }
      }
    }
  };

  const PurchaseStockFromBank = async () => {
    SetError(false);

    console.log("Amount to purchase: " + PurchaseBank);
    // console.log(PurchaseBank * buyPricePerstockFromBank);
    currentFunds();
    if (PurchaseBank > 0) {
      if (PurchaseBank * buyPricePerstockFromBank > funds) {
        SetError(true);
        setErrormsg("the company doesn't have Sufficient Funds");
      } else {
        try {
          let tx = await contract.PurchaseStockFromBank(PurchaseBank);
          await tx.wait();

          let price = PurchaseBank * buyPricePerstockFromBank;

          console.log("Price to transfer to bank: " + price);
          try {
            tx = await bankContract.deposit(price, { value: price.toString() });
          } catch (error) {
            console.log(error);
            SetIllegalError(true);
          }
          Stockinventory();
          currentFunds();
        } catch (e) {
          console.log(e);
          if (e.toString().includes(" rejected transaction")) {
            SetError(true);
            setErrormsg("the transaction is rejected");
          }
        }
      }
    }
  };

  const BuyStockFromCompany = async () => {
    SetError(false);
    const price = CompanySellPrice * BuyStock;
    if (price > 0) {
      console.log("Bill: " + price);

      if (BuyStock > Stocks) {
        SetError(true);
        setErrormsg("the company doesn't have sufficient stock");
      } else {
        try {
          let tx = await contract.BuyStockFromCompany(BuyStock, {
            value: price.toString(),
          });

          console.log("Transaction successful:", tx);
          Stockinventory();
          currentFunds();
        } catch (e) {
          console.error("Transaction failed:", error);
          if (e.toString().includes(" rejected transaction")) {
            SetError(true);
            setErrormsg("the transaction is rejected");
          }
        }
      }
    }
  };

  const WithdrawAll = async () => {
    SetError(false);
    try {
      let tx = await contract.WithdrawAll();
      await tx.wait();
    } catch (e) {
      if (e.toString().includes(" rejected transaction")) {
        SetError(true);
        setErrormsg("the transaction is rejected");
      }
    }
  };

  const transferOwnerShip = async () => {
    SetError(false);
    try {
      let tx = await contract.transferOwnerShip(newowner);
      owner = newowner;
      await tx.wait();
    } catch (e) {
      console.log(e);
      if (e.toString().includes("Not the Owner")) {
        SetError(true);
        setErrormsg("you are not the owner");
      }
    }
  };

  const SellAllStocks = async () => {
    SetError(false);
    try {
      Stockinventory();
      let price = await contract.sellPricePerstockFromBank();
      price = parseInt(price._hex, 16);

      let ret = price * Stocks;
      console.log("Price to Recieve from Bank " + ret);

      if (ret > 0) {
        let tx = await contract.SellAllStocks();

        console.log("Stocks sold");
        tx = await bankContract.BuyStock(ret, owner, {
          value: ret.toString(),
        });
        await tx.wait();

        WithdrawAll();
        Stockinventory();
        currentFunds();
      }
    } catch (e) {
      console.log(e);
      if (e.toString().includes("Not the Owner")) {
        SetError(true);
        setErrormsg("you are not the owner");
      }
      if (e.toString().includes("rejected transaction")) {
        SetError(true);
        setErrormsg("the transaction is rejected");
      }
    }
  };

  return (
    <div className="App">
      {IllegalError ? (
        <div className="Error Message1">
          Stock Buying Cancelled as transaction was rejected by the user
        </div>
      ) : (
        <header className="App-header">
          {error && (
            <div className="Error Message">
              Error: Can't complete this transaction as {errormsg}
            </div>
          )}

          <br></br>
          {currentAccount ? (
            <>
              <div>Connected Account: {currentAccount}</div>
              <br></br>
              <div className="Invest">
                <button onClick={Invest}>Fund for the Company</button>
                <input
                  type="number"
                  value={InvestAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  placeholder="Amount to Invest"
                />
              </div>

              <br></br>

              <div className="Funds">
                <button onClick={currentFunds}>Get Current Funds</button>
                {funds !== 0 ? (
                  funds != null ? (
                    <div>Funds: {funds}</div>
                  ) : (
                    <div></div>
                  )
                ) : (
                  <div>Company out of Funds</div>
                )}
              </div>

              <div className="PurchaseStocks">
                <button onClick={PurchaseStockFromBank}>
                  Buy Stock for the Company from Bank
                </button>
                <input
                  type="number"
                  value={PurchaseBank}
                  onChange={(e) => setPurchaseBank(e.target.value)}
                  placeholder="Amount to purchase"
                />
              </div>

              <div className="Stocks">
                <button onClick={Stockinventory}>Get Current Stock</button>
                {Stocks !== 0 ? (
                  Stocks !== null ? (
                    <div>Stocks: {Stocks}</div>
                  ) : (
                    <div></div>
                  )
                ) : (
                  <div>Company out of Stock</div>
                )}
              </div>

              <div className="BuyStocks">
                <button onClick={BuyStockFromCompany}>
                  Buy Stock from the Company
                </button>
                <input
                  type="number"
                  value={BuyStock}
                  onChange={(e) => setBuyStock(e.target.value)}
                  placeholder="Amount of Stock to buy"
                />
              </div>

              <div className="transferOwner">
                <button onClick={transferOwnerShip}>
                  Sell Company to a new owner
                </button>
                <input
                  value={newowner}
                  onChange={(e) => setnewowner(e.target.value)}
                  placeholder="Address of the new owner"
                />
              </div>

              <div className="SellAll">
                <button onClick={SellAllStocks}>
                  Sell All Stocks to Bank for 50% price and Withdraw all funds
                </button>
              </div>

              {/* <div className="WithdrawAll">
              <button onClick={WithdrawAll}>Withdraw All funds</button>
            </div> */}
            </>
          ) : (
            <button onClick={connect}>Connect Wallet</button>
          )}
        </header>
      )}
    </div>
  );
}

export default App;
