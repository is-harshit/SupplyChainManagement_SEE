// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bank {

    address public owner;

    constructor(){
        owner=msg.sender;
    }

    function BuyStock(uint value, address _toAddress) public payable {
        require(address(this).balance >= value * 1 wei, "Bank is Bankrrupt");
        payable(_toAddress).transfer(value);
    }

    function deposit() public payable {}

    function WithdrawAllToOwner() public payable {
        require(msg.sender==owner,"Not the owner");
        payable(owner).transfer(address(this).balance);
    }
}
