import React, {Component} from 'react';
import {Button, Card} from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/layout';




class CampaignIndex extends Component{

  //getInitialProps has to be a class method so it can get the
  //propoeties the instance should be instantiated with.
  static async getInitialProps() {
    console.log('getting data ');
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    console.log('got data back');
    return {campaigns};
  }

  renderCampaigns() {

    const items = this.props.campaigns.map(address => {
      console.log(address);
      return {
        header: address,
        description: <a>View Campaign</a>,
        fluid: true
      };
    });

    return (<Card.Group items={items} />);
  }

  render(){

    return (
      <Layout >
        <div>
          <h3> Open Campaigns </h3>

          <Button
            content='Add Campaign'
            floated='right'
            icon='add circle'
            labelPosition='left'
            positive />
            {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}


export default CampaignIndex;
