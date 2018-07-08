require('events').EventEmitter.defaultMaxListeners = 15;
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const fs = require('fs-extra');



var compiledFactory = require('../ethereum/build/CampaignFactory.json');
var compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async() => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({data: compiledFactory.bytecode})
    .send({from: accounts[0], gas: '1000000'});


    await factory.methods.createCampaign(100)
      .send({from: accounts[0], gas: '1000000'});
    //the syntax of variable name inside [] says =>
    // I know im gonna get an array ... put the first eleent inside this variable
    let campaigns = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = campaigns[0];

    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
});


describe("Campaigns", ()=>{
  it('deploys a factory and a campaign ', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as campaign manager", async() => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute money and marks them as approvers", async()=>{
    await campaign.methods.contribute().send({value: 1000, from: accounts[1]});
    const is_approver =  await campaign.methods.approvers(accounts[1]).call();
    assert(is_approver);
  });

  it("requires min contribution", async()=>{
    try {
      await campaign.methods.contribute().send({value: 99, from: accounts[1]});
      assert(false);
    } catch(err){
      assert.ok(err);
    }
  });

  it("manager can create request", async() => {
    await campaign.methods
    .createRequest('buy Batteries', 100, accounts[1])
    .send({from: accounts[0], gas: '1000000'});
    const request = await campaign.methods.requests(0).call();
    assert.equal('buy Batteries', request.description);

  });

  it("processes requests", async() => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });

    await campaign.methods
      .createRequest('a', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({from: accounts[0], gas: '1000000'});

    await campaign.methods.approveRequest(0).send({from: accounts[0], gas: '1000000'});
    await campaign.methods.finalizeRequest(0).send({from: accounts[0], gas:"1000000"});

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');

    balance = parseFloat(balance);
    console.log(balance);
    assert(balance > 103);

  });
});
