import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

export default () =>  {

  return (
    <Menu style={{margin: '20px;'}}>
      <Menu.Item name='kickcoin' >
        KickCoin
      </Menu.Item>

      <Menu.Menu position='right'>
        <Menu.Item name='campaigns'  >
          Campaigns
        </Menu.Item>

        <Menu.Item name='plus'  >
          +
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

