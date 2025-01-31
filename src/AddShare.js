import React, { Component } from "react";
import { Button, Label, FormGroup } from "reactstrap";
import { AvForm, AvField, AvInput, AvGroup} from 'availity-reactstrap-validation';
import axios from "axios";

export class AddShare extends Component {

  newShare;

  constructor(props) {
    super(props);
    this.addShareForm = this.addShareForm.bind(this);
    this.addShare = this.addShare.bind(this);
    this.cancelAddShare = this.cancelAddShare.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.submitOnEnter = this.submitOnEnter.bind(this);
    this.state = {
      action: "none",
      share: {}
    };
  }

  addShareForm() {
    this.setState({
      action: "add"
    });
  }

  cancelAddShare() {
    this.setState({
      action: "none"
    });
  }

  addShare(event, values) {
    this.setState({
      share: values
    }, () => {
      if (this.state.share.name === '' || this.state.share.purchasePrice === '') {
        console.log("No share name or price, ignoring.");
        return;
      }
      let d = this.state.share.purchaseDate;
      if (d == null || d === "") {
        d = AddShare.currentDate()
      }
      let apiKey = this.props.alphavantage['apiKey'];
      let searchNameUrl = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" + this.state.share.name + "&apikey=" + apiKey;
      let bestMatch = null;
      axios.get(searchNameUrl).then(res => {
        console.log(res.data.bestMatches);
        if (res && res.data && res.data.bestMatches && res.data.bestMatches.length > 0) {
          bestMatch = res.data.bestMatches[0];
          console.log("BEST SHARE MATCH = ", bestMatch);
          return bestMatch
        } else {
          console.error("NOT MATCH found for share = ", this.state.share.name);
        }
        return null
      }).then(bestMatch => {
        console.log(
          "Add share",
          this.state.share.name,
          this.state.share.purchasePrice,
          d,
          bestMatch
        ); //FIXME remove console log
        this.props.newShare(this.state.share.name, this.state.share.purchasePrice, d, bestMatch);
        this.setState({
          action: "none",
          share: {}
        });
      })
    });
  }

  static currentDate() {
    let now = new Date();
    return now.toLocaleDateString();
  }

  handleNameChange(event) {
    console.log("Update event", event.target, event.target.value); //FIXME remove console log
    // TODO use search endpoint from https://www.alphavantage.co/documentation/
    this.setState({
      share: {
        name: event.target.value
      }
    });
  }

  handlePriceChange(event) {
    console.log("Update event", event.target, event.target.value); //FIXME remove console log
    this.setState({
      share : {
        purchasePrice: event.target.value
      }
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
          <div className="App App-add-share">
              <AvForm onValidSubmit={this.addShare}>
                <h2>New share details</h2>
                <AvGroup row>
                  <Label for="name">Name</Label>
                  <AvInput name="name" id="name" defaultValue={this.state.share.name} onChange={this.handleNameChange} required/>
                </AvGroup>
                <AvGroup row>
                  <Label for="price">Purchase price</Label>
                  <AvInput name="purchasePrice" id="price" defaultValue={this.state.share.purchasePrice} onChange={this.handlePriceChange} required/>
                </AvGroup>
                <div className="App App-add-share-button">
                <FormGroup>
                  <Button color="success">Confirm</Button>
                  &nbsp;
                  <Button color="danger" onClick={this.cancelAddShare}>Cancel</Button>
                </FormGroup>
                </div>
              </AvForm>
          </div>
        )}
      </div>
    );
  }

}
