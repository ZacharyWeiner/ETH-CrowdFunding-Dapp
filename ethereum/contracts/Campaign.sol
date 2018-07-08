pragma solidity ^0.4.17;

contract CampaignFactory{
    address[] deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    function getDeployedCampaigns() public view returns (address[]){
        return deployedCampaigns;
    }
}
contract Campaign{

    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
    }

    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    Request[] public requests;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor (uint minimum, address creator) public{
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable{
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string description, uint value, address recipient) public restricted{
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        require(approvers[msg.sender]);
        //bang to reverse the condition -
        //has submitted a vote on the request
        //returns true, but needs to be false to fail in require
        //completing the psudo authorization
        Request storage request = requests[index];
        require(!request.approvals[msg.sender]);
        request.approvalCount++;
        request.approvals[msg.sender] = true;
    }

    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount > (approversCount /2));
        request.complete = true;
        request.recipient.transfer(request.value);
    }
}
