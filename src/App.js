import React, { Component } from "react";
import yield_img from "./img/yield.svg";
import "./App.css";

import { AddShare } from "./AddShare";
import { MyStocksTable } from "./MyStocksTable";

import Firebase from "firebase";
import config from "./config";

class App extends Component {
  constructor(props) {
    super(props);

    // TODO: fix loading data delay on startup
    //  https://stackoverflow.com/questions/41939769/firebase-on-app-startup-taking-more-than-3-seconds-to-load-data
    Firebase.initializeApp(config);

    this.state = {
      sharesList: [],
      loading: true
          // [{ name: "ebay", value: 36 }, { name: "Amazon", value: 1850 }] TODO remove sample data
    };

    this.handleNewShare = this.handleNewShare.bind(this);
    this.removeShare = this.removeShare.bind(this);
  }

  writeShareData = () => {
    console.log("about to overwrite firebase with: ", this.state.sharesList);
    Firebase.database()
      .ref("/shares")
      .set(this.state.sharesList);
    console.log("DATA SAVED", this.state.sharesList);
  };

  getShareData = () => {
    let ref = Firebase.database().ref("/shares");
    ref.on("value", snapshot => {
      const shares = snapshot.val() || [];
      console.log("DATA RETRIEVED", shares);
      this.setState({
        sharesList: shares
      });
      console.log("DATA UPDATED after retrieval", this.state.sharesList);
    });
  };

  componentDidMount() {
    this.setState({
      loading: false
    });
    this.getShareData();
  }

  handleNewShare = (newShareName, newSharePrice) => {
    console.log("Adding", newShareName, newSharePrice); // FIXME remove console log
    this.setState((prevState) => {
      return {
        // Use updater 'return' to make state available immediately even if not rendered yet
        // https://css-tricks.com/understanding-react-setstate/
        sharesList: prevState.sharesList.concat({
          name: newShareName,
          value: newSharePrice
        })
      };
    }, this.writeShareData);

    console.log("New share added, shares are now: ", this.state.sharesList); // FIXME remove console log
  };

  removeShare = shareName => {
    console.log("Removing", shareName); // FIXME remove console log
    this.setState((prevState )=> {
      return {
        sharesList: prevState.sharesList.filter(s => s.name !== shareName)
      };
    }, this.writeShareData);

    console.log("Removed share. List is now:", this.state.sharesList); // FIXME remove console log
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
          sharesList={this.state.sharesList}
          removeShare={this.removeShare}
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
      <p className="App App-body">
        <AddShare newShare={this.props.handleNewShare} />
        <MyStocksTable
          shares={this.props.sharesList}
          removeShare={this.props.removeShare}
        />
        {/* // <MyStockValueGraph /> */}
      </p>
    );
  }
}

export default App;
