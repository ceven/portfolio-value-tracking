import React, { Component } from "react";
import { Button } from "reactstrap";
import axios from "axios";

export class AddShare extends Component {

  newShare;

  constructor(props) {
    super(props);
    this.addShareForm = this.addShareForm.bind(this);
    this.addShare = this.addShare.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.submitOnEnter = this.submitOnEnter.bind(this);
    this.state = {
      action: "none",
      shareName: "",
      sharePurchasePrice: 0,
      sharePurchaseDate: null
    };
  }

  addShareForm() {
    this.setState({
      action: "add"
    });
  }

  addShare() {
    if (this.state.shareName === '' || this.state.sharePurchasePrice === '') {
      console.log("No share name or price, ignoring.");
      return;
    }
    let d = this.state.sharePurchaseDate;
    if (d == null || d === "") {
      d = AddShare.currentDate()
    }
    let apiKey = this.props.alphavantage['apiKey'];
    let searchNameUrl = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" + this.state.shareName + "&apikey=" + apiKey;
    let bestMatch = null;
    axios.get(searchNameUrl).then(res => {
      console.log(res.data.bestMatches);
      if (res && res.data && res.data.bestMatches && res.data.bestMatches.length > 0) {
        bestMatch = res.data.bestMatches[0];
        console.log("BEST SHARE MATCH = ", bestMatch);
        return bestMatch
      }
      return null
    }).then(bestMatch => {
      console.log(
        "Add share",
        this.state.shareName,
        this.state.sharePurchasePrice,
        d,
        bestMatch
      ); //FIXME remove console log
      this.props.newShare(this.state.shareName, this.state.sharePurchasePrice, d, bestMatch);
      this.setState({
        action: "none",
        shareName: "",
        sharePurchasePrice: 0,
        sharePurchaseDate: ""
      });
    })

  }

  static currentDate() {
    let now = new Date();
    return now.toLocaleDateString();
  }

  handleNameChange(event) {
    console.log("Update event", event.target, event.target.value); //FIXME remove console log
    // TODO use search endpoint from https://www.alphavantage.co/documentation/
    this.setState({
      shareName: event.target.value
    });
  }

  handlePriceChange(event) {
    console.log("Update event", event.target, event.target.value); //FIXME remove console log
    this.setState({
      sharePurchasePrice: event.target.value
    });
  }

  submitOnEnter(event) {
    console.log("Update event", event.target, event.target.value); //FIXME remove console log
    if (event.key === "Enter") {
      this.addShare();
    }
  }

  render() {
    return (
      <div>
        {this.state.action === "none" && (
          <Button color="success" onClick={this.addShareForm}>
            Add share
          </Button>
        )}
        {this.state.action === "add" && (
          // FIXME change to form and automatically map form name to DB keys
          <div>
            <input
              type="text"
              value={this.state.shareName}
              onChange={this.handleNameChange}
              onKeyDown={this.submitOnEnter}
            />
            <input
              type="text"
              value={this.state.sharePurchasePrice}
              onChange={this.handlePriceChange}
              onKeyDown={this.submitOnEnter}
            />
            <Button color="success" onClick={this.addShare}>
              Confirm
            </Button>
          </div>
        )}
      </div>
    );
  }
}
