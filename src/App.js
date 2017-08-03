import React, { Component } from 'react';
import Layout from './components/Layout'
import { IntlProvider } from 'react-intl'

class App extends Component {
  
  render() {
    return (
    <IntlProvider locale="en">
        <Layout />      
    </IntlProvider>
    );
  }
}

export default App;
