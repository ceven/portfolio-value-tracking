import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { Button } from 'reactstrap';
import './MyStocksTable.css';

class RemoveShare extends Component {
    
    constructor(props) {
        super(props);
        this.removeShare = this.removeShare.bind(this);
    }

    removeShare() {
        // TODO
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

    constructor(props) {
        super(props);
    }

    renderTable = () => {
        return (
            <div>
                <Table className="Table">
                    <tbody>
                    {
                        this.props.shares && this.props.shares.map(share => {
                            return (
                            <tr>
                                <td>{share.name}</td>
                                <td>{share.value}</td>
                                <td><RemoveShare name={share.name} removeShare={this.props.removeShare}/></td>
                            </tr>
                            )
                        })
                    }
                    </tbody>
                </Table>
            </div>
        )
    }

    render() {
        return (
            <div className="MyStocksTable">
                {this.renderTable()}
            </div>
        )
    }
}
