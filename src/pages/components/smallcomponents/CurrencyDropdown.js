import React, { Component } from 'react'
import styled from "styled-components";
import { connect } from 'react-redux';

import DollarSign from "../../../assets/DollarSign.png";
import downDrop from "../../../assets/downDrop.png";
import {currencyMaintained} from '../../../state/action-creators/index';


const Currencydata = [{id: 0, label: "$ USD"}, {id: 1, label: "£ GBP"}, {id: 3, label: "¥ JPY"}, {id: 4, label: "₽ RUB"}];

class CurrencyDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: 'false',
            currencyItems: Currencydata,
            selectedCurrency: 0
        }
    }

    handleClickCurrency(id) {
        this.setState({ selectedCurrency: id })
        this.props.currencyMaintainedHere(Currencydata ? Currencydata.find(item => item.id === id).label.toString().slice(0,1) : "$")
        
    }

    toggleDropdown(whetherOpen) {
        this.setState({ isOpen: !whetherOpen })
    }

    render() {
        return (
            <div>
                <div>
                    {/* <img style={{height: '30px', marginTop: '10px', marginBottom: '-2px', marginRight: '20px'}} src={DollarSign} alt="img" /> */}
                    <DropDown>
                        <DropDownHeader onClick={() => this.toggleDropdown(this.state.isOpen)}  >
                            {this.state.selectedCurrency ? this.state.currencyItems.find(item => item.id === this.state.selectedCurrency).label.toString().slice(0,1) : "$"}
                            <IconArrow style={{height: '4px', marginBottom: '-2px', marginLeft: '10px'}} src={downDrop} dropdown={this.state.isOpen} alt="img" />
                        </DropDownHeader>
                        <DropDownBody className={`${this.isOpen && 'open'}`} dropdown={this.state.isOpen}>
                            {this.state.currencyItems.map(item => (
                                <DropDownItem onClick={e => this.handleClickCurrency(item.id)} id={item.id}>
                                    <DropDownItemDot className={` ${item.id === this.selectedCurrency && 'selected'}`}>• </DropDownItemDot>
                                    {item.label}
                                </DropDownItem>
                            ))}
                        </DropDownBody>
                    </DropDown>
                </div>


            </div>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        currencyMaintainedHere: (currency) => {
            console.log(currency)
            dispatch(currencyMaintained(currency))
        }    
    }
}
export default connect(null, mapDispatchToProps)(CurrencyDropdown);



const DropDown = styled.div`
    // border-radius: 10px;
    // background-color: white;
    // z-index: 100;
`

const DropDownHeader = styled.div`
    padding: 15px;
    cursor: pointer;
    display: flex;
    // justify-content: space-between;
    align-items: center;
`

const DropDownBody = styled.div`
    padding: 5px;
    border-top: 1px solid #E5E8EC;
    display: ${props => props.dropdown === false ? "block" : "none"};
    background-color: white;
    box-shadow: 0 10px 25px rgba(0,0,0,.1);
    z-index: 10;
    position: absolute;


`

const DropDownItem = styled.div`
    padding: 10px;

    .hover {
        cursor: pointer;
    }
`


const DropDownItemDot = styled.span`
    opacity: 0;
    color: #91A5BE;
    transition: all .2s ease-in-out;
    
    .selected {
        opacity: 1;
    }
`


const IconArrow = styled.img`
    transform: ${props => props.dropdown === false ? "rotate(180deg)" : "rotate(0deg)"};
    transition: all .2s ease-in-out;

`