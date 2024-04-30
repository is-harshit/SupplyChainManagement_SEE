//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WillyWonkaFactory {
    uint256 private chocolateBag;

    function buyChocolates(uint256 no) public payable {
        require(chocolateBag + no <= 1000, "Bag is full");
        chocolateBag += no;
    }

    function sellChocolates(uint256 toSell) public payable {
        require(toSell <= chocolateBag, "Not enough Chocolates");
        chocolateBag -= toSell;
    }

    function showChocolates() public view returns (uint256) {
        return chocolateBag;
    }
}
