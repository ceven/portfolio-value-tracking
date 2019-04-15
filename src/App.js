import React, { Component } from 'react';
import yield_img from './img/yield.svg';
import './App.css';

import { AddShare } from './AddShare';
import { MyStocksTable } from './MyStocksTable';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={yield_img} className="App-logo" alt="logo" />
          <h1 className="App-title">Portfolio Value Tracker</h1>
        </header>

          <Body/>
        <footer>
          <div>Icons made by <a href="https://www.flaticon.com/authors/geotatah" title="geotatah">geotatah</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
        </footer>
      </div>
    );
      }
    }
    
    
class Body extends Component {

  constructor(props) {
    super(props);
    this.handleNewShare = this.handleNewShare.bind(this);
    this.removeShare = this.removeShare.bind(this);
    this.state = {
      sharesList: [{ name: 'ebay', value: 36 }, { name: 'Amazon', value: 1850 }]// FIXME remove values, generte dynamically from DB
    }
  }

    handleNewShare = (newShareName, newSharePrice) => {
      console.log("Adding", newShareName, newSharePrice) // FIXME remove console log
      this.setState({
        sharesList: this.state.sharesList.concat({ name: newShareName, value: newSharePrice})
      })
      console.log('New share', this.state.sharesList) // FIXME remove console log
    }

    removeShare = (shareName) => {
      console.log("Removing", shareName) // FIXME remove console log
      var newList = this.state.sharesList.filter(s=> s.name !== shareName)
      this.setState({
        sharesList: newList
      })
      console.log('Removed share. List is now:', this.state.sharesList) // FIXME remove console log
    }

    render() {
        return(
          <p className="App App-body">
            <AddShare newShare={this.handleNewShare} />
            <MyStocksTable shares={this.state.sharesList} removeShare={this.removeShare}/>
        {/* // <MyStockValueGraph /> */}
          </p>
      )
    }
}
    
    export default App;
