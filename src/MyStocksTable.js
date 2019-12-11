import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { Button } from 'reactstrap';
import './MyStocksTable.css';
import { AvForm, AvInput } from 'availity-reactstrap-validation';

class MyStocksTableRow extends Component {

  share;

  constructor(props) {
    super(props);
    this.state = {
      editing: false
    }
  }

  saveUpdatedShare = (event, values) => {
    this.toggleEditShare();
    console.info("EDITING ",event, values, this.props.share);
    this.props.editShare(this.props.share.name, values);
  };

  toggleEditShare = () => {
    this.setState(prevState => ({
      editing: !prevState.editing,
    }));
  };

  computeProfit() {
    if (this.props.share.purchasePrice && this.props.share.soldPrice && this.props.share.quantity) {
      return parseFloat(this.props.share.quantity * (this.props.share.soldPrice - this.props.share.purchasePrice)).toFixed(2)
    }
  }

  render() {
    return (
        <tr>
          {/* FIXME: edit all vals at once? currently one by one. edit example: https://stackblitz.com/edit/reactstrap-v5-tyjxxh?file=Example.js */}
          {this.state.editing ? <td><AvForm onValidSubmit={this.saveUpdatedShare}> <AvInput name="name" defaultValue={this.props.share.name} /></AvForm></td> : <td>{this.props.share.name}</td>}
          {this.state.editing ? <td><AvForm onValidSubmit={this.saveUpdatedShare}> <AvInput name="purchasePrice" defaultValue={this.props.share.purchasePrice} /></AvForm></td> : <td>{this.props.share.purchasePrice}</td>}
          {this.state.editing ? <td><AvForm onValidSubmit={this.saveUpdatedShare}> <AvInput name="purchaseDate" defaultValue={this.props.share.purchaseDate} /></AvForm></td> : <td>{this.props.share.purchaseDate}</td>}
          {this.state.editing ? <td><AvForm onValidSubmit={this.saveUpdatedShare}> <AvInput name="quantity" defaultValue={this.props.share.quantity} /></AvForm></td> : <td>{this.props.share.quantity}</td>}
          {this.state.editing ? <td><AvForm onValidSubmit={this.saveUpdatedShare}> <AvInput name="soldPrice" defaultValue={this.props.share.soldPrice} /></AvForm></td> : <td>{this.props.share.soldPrice}</td>}
          {this.state.editing ? <td><AvForm onValidSubmit={this.saveUpdatedShare}> <AvInput name="soldDate" defaultValue={this.props.share.soldDate} /></AvForm></td> : <td>{this.props.share.soldDate}</td>}
          {<td>{this.computeProfit()}</td>}
          <td><Button color="info" onClick={this.toggleEditShare}>{this.state.editing ? 'Cancel'  : 'Edit'}</Button></td>
          <td><RemoveShare name={this.props.share.name} removeShare={this.props.removeShare}/></td>
        </tr>
    )
  }

}

class MyStocksTableSummary extends Component {

  shares;

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <tr>
        <td>Total</td>
        <td/>
        <td/>
        <td/>
        <td/>
        <td/>
        <td>{this.sumProfit()}</td>
        <td/>
        <td/>
      </tr>
    )
  }

  static computeProfit(share) {
    if (share.purchasePrice && share.soldPrice && share.quantity) {
      return parseFloat(share.quantity * (share.soldPrice - share.purchasePrice))
    }
  }

  sumProfit = () => {
    let profit = 0;
    if (this.props.shares) {
      Array.from(this.props.shares.values()).forEach(share => {
        let shareProfit = MyStocksTableSummary.computeProfit(share);
        if (shareProfit && !isNaN(shareProfit)) {
          profit += shareProfit
        }
      })
    }
    return profit.toFixed(2)
  }
}

class RemoveShare extends Component {
    
    constructor(props) {
        super(props);
        this.removeShare = this.removeShare.bind(this);
    }

    removeShare() {
        this.props.removeShare(this.props.name)
    }

    render() {
        return (
            <div>
                <Button onClick={this.removeShare}>Remove</Button>
            </div>
        )
    }
}

export class MyStocksTable extends Component {

  shares;

  constructor(props) {
    super(props);
  }

  renderTable = () => {
        return (
            <div>
                <Table className="Table" hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Purchase price</th>
                        <th>Purchase date</th>
                        <th>Quantity</th>
                        <th>Sold price</th>
                        <th>Sold date</th>
                        <th>Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.shares && Array.from(this.props.shares.values()).map(share => {
                            return <MyStocksTableRow key={share.name} share={share} editShare={this.props.editShare} removeShare={this.props.removeShare}/>
                        })
                    }
                    {<MyStocksTableSummary shares={this.props.shares}/>}
                    {this.props.shares && console.info("Map "+this.props.shares.size + " array " + Array.from(this.props.shares.values()))}
                    {!this.props.shares && console.warn("no shares")}
                    </tbody>
                </Table>
            </div>
        )
    };

    render() {
        return (
            <div className="MyStocksTable">
                {this.renderTable()}
            </div>
        )
    }

}
