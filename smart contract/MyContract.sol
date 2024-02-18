// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    string public data;
    uint256 private userIdCounter;
    address private contractOwner; // New variable for owner address

    event DataUpdated(string newData);
    event UserRegistered(uint256 userId, address userAddress);
    event UserApproved(uint256 userId, address approver);

    mapping(uint256 => bool) private approvedUsers;

    constructor() {
        userIdCounter = 1; // Start the counter from 1
        contractOwner = msg.sender; // Assign the contract deployer as the owner
    }

    function generateUniqueId() private returns (uint256) {
        uint256 uniqueId = userIdCounter;
        userIdCounter++;
        return uniqueId;
    }

    function registerUser(string memory) public {
        uint256 userId = generateUniqueId();
        // You can store the user data or perform additional actions here
        emit UserRegistered(userId, msg.sender);
    }

    function approveUser(uint256 _userId) public {
        require(msg.sender == contractOwner, "Only the owner can approve users"); // Updated check with contractOwner
        require(!approvedUsers[_userId], "User is already approved");
        
        approvedUsers[_userId] = true;
        emit UserApproved(_userId, msg.sender);
    }

    function setData(string memory _data) public {
        require(approvedUsers[usageId(msg.sender)], "User not approved"); // Updated function name with usageId
        data = _data;
        emit DataUpdated(_data);
    }

    function usageId(address userAddress) public pure returns (uint256) {
        // You may need a more sophisticated way to map addresses to user IDs
        // For simplicity, using a basic hash here
        return uint256(keccak256(abi.encodePacked(userAddress)));
    }

    function getOwner() public view returns (address) {
        return contractOwner;
    }

    receive() external payable { }

    fallback() external payable { }

    function getData() public view returns (string memory) {
        return data;
    }
}