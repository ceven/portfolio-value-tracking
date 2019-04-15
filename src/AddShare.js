import React, { Component } from 'react';
import { Button } from 'reactstrap';

export class AddShare extends Component {

    constructor(props) {
        super(props); 
        this.addShareForm = this.addShareForm.bind(this);
        this.addShare = this.addShare.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.state = {
            action: 'none',
            shareName: '',
            sharePurchasePrice: 0
        }
    }

    addShareForm() {
        this.setState ({
            action: 'add'
        })
    }

    addShare() {
        console.log('Add share', this.state.shareName, this.state.sharePurchasePrice);//FIXME remove console log
        this.props.newShare(this.state.shareName, this.state.sharePurchasePrice);
        this.setState({
            action: 'none',
            shareName: '',
            sharePurchasePrice: 0
        })
    }

    handleNameChange(event) {
        console.log('Update event', event.target, event.target.value);//FIXME remove console log
        this.setState({
            shareName: event.target.value
        });
    }

    handlePriceChange(event) {
        console.log('Update event', event.target, event.target.value);//FIXME remove console log
        this.setState({
            sharePurchasePrice: event.target.value
        });
    }

    render() {
        return (
            <div>
                { this.state.action === 'none' && <Button color="success" onClick={this.addShareForm}>Add share</Button>}
                { this.state.action === 'add' && 
                <div>
                    <input type='text' value={this.state.shareName} onChange={this.handleNameChange}></input>
                    <input type='text' value={this.state.sharePurchasePrice} onChange={this.handlePriceChange}></input>
                    <Button color='success' onClick={this.addShare}>Confirm</Button>
                </div>}
            </div>
        )
    }
}
