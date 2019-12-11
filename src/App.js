import React, { Component } from "react";
import yield_img from "./img/yield.svg";
import "./App.css";

import { AddShare } from "./AddShare";
import { MyStocksTable } from "./MyStocksTable";

import Firebase from "firebase";
import config from "./config";

// NB: Treat React DS as immutable
// when updating state, always do a deep copy first
// V. good post: https://www.robinwieruch.de/react-state-array-add-update-remove

const DEFAULT_PORTFOLIO_PATH = '/shares/default_user/default_portfolio/';

// TODO currently each share is indexed by name
//  need unique key e.g. append current timestamp to name so can add several records for same share name

class App extends Component {
  constructor(props) {
    super(props);

    //  https://stackoverflow.com/questions/41939769/firebase-on-app-startup-taking-more-than-3-seconds-to-load-data
    Firebase.initializeApp(config);

    this.state = {
      portfolioShares: null,
      loading: true
    };

    this.handleNewShare = this.handleNewShare.bind(this);
    this.removeShare = this.removeShare.bind(this);
  }

  writeShareData = () => {
    console.log("about to overwrite firebase with: ", this.state.portfolioShares);
    Firebase.database()
      .ref(DEFAULT_PORTFOLIO_PATH)
      .set(this.state.portfolioShares)
      .then(function (){
        console.log("DATA SAVED");
      });
  };

  writeSingleShare = (share) => {
    console.log("about to add share: ", share);
    Firebase.database()
      .ref(App.getFirebasePath(share))
      .set(share)
      .then(function (){
        console.log("SINGLE SHARE SAVED ", share.toString());
      });
  };

  static getFirebasePath(share) {
    return DEFAULT_PORTFOLIO_PATH + share.name;
  }

  deleteDbShare = (share) => {
    console.log("about to remove share: ", share);
    Firebase.database()
      .ref(App.getFirebasePath(share))
      .remove()
      .then(function() {
        console.log("SHARE REMOVED ", share)
      })
  };

  getShareData = () => {
    let ref = Firebase.database().ref(DEFAULT_PORTFOLIO_PATH);
    ref.on("value", snapshot => {
      let fShares = snapshot.val() || {};
      this.setState(() => {
        let shares = new Map(); // FIXME couldn't find a simple way to populate Map()
        Object.keys(fShares).forEach((key) => {
          shares.set(fShares[key].name, fShares[key])
        });
        console.log("DATA RETRIEVED ", shares);
        return {
          portfolioShares: shares
        }
      }, () => {
        console.log("SHARES ", this.props.portfolioShares);
      });
    });
  };

  componentDidMount() {
    this.setState({
      loading: false
    });
    this.getShareData();
  }

  handleNewShare = (newShareName, newSharePrice, purchaseDate) => {
    let newShare = {
      name: newShareName,
      purchasePrice: newSharePrice,
      purchaseDate: purchaseDate
    };
    console.log("Adding", newShare); // FIXME remove console logs
    this.setState((prevState) => {
      const m = new Map(prevState.portfolioShares);
      m.set(newShare.name, newShare);
      return {
        // Use updater 'return' to make state available immediately even if not rendered yet
        // https://css-tricks.com/understanding-react-setstate/
        portfolioShares: m
      }
    }, this.writeSingleShare(newShare));

    console.log("New share added, shares are now: ", this.state.portfolioShares); // FIXME remove console log
  };

  removeShare = share => {
    console.log("Removing", share); // FIXME remove console log
    this.setState((prevState ) => {
      const m = new Map(prevState.portfolioShares);
      m.delete(share.name);
      return {
        portfolioShares: m
      };
    }, this.deleteDbShare(share));

    console.log("Removed share. List is now:", this.state.portfolioShares); // FIXME remove console log
  };

  editShare = (share, newValues) => {
    console.log("Updating share with new vals", share, newValues);
    let updatedShare = this.state.portfolioShares.get(share.name);
    Object.keys(newValues).forEach(function(k) {
      updatedShare[k] = newValues[k]
    });

    this.setState((prevState) => {
      const m = new Map(prevState.portfolioShares);
      if (newValues.name && newValues.name !== share.name) {
        m.delete(share.name);
      }
      m.set(newValues.name, updatedShare);
      return {
        portfolioShares: m
      };
    }, () => {
      if (newValues.name && newValues.name !== share.name) {
        this.deleteDbShare(share);
      }
      this.writeSingleShare(updatedShare);
      console.info("Done editing", updatedShare)
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={yield_img} className="App-logo" alt="logo" />
          <h1 className="App-title">Portfolio Value Tracker</h1>
        </header>

        {this.state.loading && <LoadingApp/>}
        {!this.state.loading && <Body
          portfolioShares={this.state.portfolioShares}
          removeShare={this.removeShare}
          editShare={this.editShare}
          handleNewShare={this.handleNewShare}
        />}
        <footer>
          <div>
            Icons made by{" "}
            <a
              href="https://www.flaticon.com/authors/geotatah"
              title="geotatah"
            >
              geotatah
            </a>{" "}
            from{" "}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>{" "}
            is licensed by{" "}
            <a
              href="http://creativecommons.org/licenses/by/3.0/"
              title="Creative Commons BY 3.0"
              target="_blank"
            >
              CC 3.0 BY
            </a>
          </div>
        </footer>
      </div>
    );
  }

}

class  LoadingApp extends Component{
  render() {
    return (<p className="App App-body">Loading...</p>)
  }
}

class Body extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App App-body">
        <AddShare newShare={this.props.handleNewShare} />
        <MyStocksTable
          shares={this.props.portfolioShares}
          removeShare={this.props.removeShare}
          editShare={this.props.editShare}
        />
        {/* // <MyStockValueGraph /> */}
      </div>
    );
  }
}

export default App;
