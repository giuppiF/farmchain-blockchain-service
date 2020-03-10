pragma solidity ^0.4.23;

contract Test {

    address public farm;
    string public name;
    string public category;
    bool public completed = false;

    constructor (string _name) public {
        name = _name;
    }

    function setCompleted() public{
        require(msg.sender == farm);
        completed = true;
    }

}