// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract SupplyChainManagement {
    address private owner;
    uint public buyPricePerstockFromBank;
    uint public sellPricePerstockFromBank;
    uint CompanySellPrice;
    uint private StockHeld;
    address public Bank;

    constructor(uint BankBuyprice, uint _CompanySellPrice) {
        owner = msg.sender;
        buyPricePerstockFromBank = BankBuyprice;
        sellPricePerstockFromBank = buyPricePerstockFromBank / 2; // Bank buys for 50% of selling price
        CompanySellPrice = _CompanySellPrice;
        // Bank = _bank;
    }

    modifier OnlyOwner() {
        require(owner == msg.sender, "Not the Owner");
        _;
    }

    function Stockinventory() public view OnlyOwner returns (uint) {
        return StockHeld;
    }

    function currentFunds() public view OnlyOwner returns (uint) {
        return address(this).balance;
    }

    function Invest(uint value) public payable {
        require(msg.value >= value * 1 wei, "Not Enough Funds passed");
    }

    function PurchaseStockFromBank(uint amount) public OnlyOwner {
        require(
            address(this).balance >= amount * buyPricePerstockFromBank * 1 wei,
            "Not enough funds to buy stock"
        );
        StockHeld += amount;
        payable(msg.sender).transfer(amount * buyPricePerstockFromBank * 1 wei);
    }

    function SellAllStocks() public payable OnlyOwner {
        require(StockHeld > 0, "No Stocks to sell to bank");
        StockHeld = 0;
    }

    function BuyStockFromCompany(uint amount) public payable {
        require(
            msg.value >= amount * CompanySellPrice * 1 wei,
            "Not enough money to buy stock"
        );
        require(StockHeld >= amount, "Company is out of stocks");

        StockHeld -= amount;
    }

    function WithdrawAll() public payable OnlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function transferOwnerShip(address _toOwner) public OnlyOwner {
        owner = _toOwner;
    }
}
