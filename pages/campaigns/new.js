import React, {Component} from 'react';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import Layout from '../../components/layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
class CampaignNew extends Component{
  state = {
    minimumContribution: '100',
    errorMessage: '',
    loading: false
  };

  onSubmit= async (event) => {
    event.preventDefault();
    this.setState({loading:true, errorMessage: ''});
    console.log("min: " + this.state.minimumContribution);
    try{
      console.log('attempting to create');
    const accounts = await web3.eth.getAccounts();
    await factory.methods.createCampaign(this.state.minimumContribution)
        .send({from: accounts[0]});
      console.log('created');
    } catch (err){
      console.log('there was an error');
      this.setState({errorMessage: err.message});
    }
    this.setState({loading: false});
  };

  //Syntax note: to change a string into a bool
  // use two bangs !!
  // the first flips the value to its opposite boolean representation
  // the second flips it back to its boolean state
  render(){
    return(
        <Layout>
        <h3> Create A New Campaign </h3>
          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} >
            <Form.Field>
              <label> Minimum Contribution To Join</label>
              <Input label='wei' labelPosition='right' value={this.state.minimumContribution}
                      onChange={event => this.setState({minimumContribution: event.target.value})} />
            </Form.Field>
            <Message
              error
              header='Oops! Something went wrong'
              content= {this.state.errorMessage}
            />
            <Button primary loading={this.state.loading}> Create </Button>
          </Form>
        </Layout>
      );
  }
}

export default CampaignNew;
