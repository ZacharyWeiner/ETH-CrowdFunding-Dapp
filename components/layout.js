import React from 'react'
import {Container} from 'semantic-ui-react';
import Header from './header'
import Head from 'next/head'

export default props => {
  return (
    <div>
    <Head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css" />
    </Head>
    <div>
    <Header />
      <Container>
        {props.children}
      </Container>
    </div>
  </div>
  );
};
