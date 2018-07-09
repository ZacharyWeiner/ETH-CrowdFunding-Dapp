import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json'
//import fs from 'fs-extra';

// const source = fs.readFileSync('../.env', 'utf8');

// const env = JSON.parse(source);

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x220162479A28e53e682446a914fDAdB43124406C'
);

export default instance;
