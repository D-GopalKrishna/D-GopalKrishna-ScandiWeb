import React, { Component } from 'react'
import styled from "styled-components";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';

import EmptyCart from "../../../assets/EmptyCart.png";
import downDrop from "../../../assets/downDrop.png";
import Cart from '../../Cart';


import { Query } from "@apollo/client/react/components";
import { LOAD_CATEGORIES, LOAD_CATEGORY, LOAD_INDIVIDUAL_PRODUCT, LOAD_CURRENCY } from "../../../graphql/queries";


class MiniCartDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: 'false',
            cartitems: localStorage.getItem('CartItems') ? JSON.parse(localStorage.getItem('CartItems')) : [],
            imageShowninCart: localStorage.getItem('CartItems') ?  Array(JSON.parse(localStorage.getItem('CartItems')).length).fill(0) : [],
            totalAmount: [
                { currency: { label: "USD", symbol: "$" }, amount: 0 }, 
                { currency: { label: "GBP", symbol: "£" }, amount: 0 }, 
                { currency: { label: "AUD", symbol: "A$" }, amount: 0 }, 
                { currency: { label: "JPY", symbol: "¥" }, amount: 0 },  
                { currency: { label: "RUB", symbol: "₽" }, amount: 0 }, 
            ]
        }
    }

    handleClickCurrency(id) {
        this.setState({ selectedCurrency: id })
        
    }

    splitAndCapitalize(word) {
        let splitWord = word.split("-");
        let capitalizedWord = splitWord.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(" ");
        return capitalizedWord;
    }

    toggleDropdown(whetherOpen) {
        this.setState({ isOpen: !whetherOpen })
    }

    SumAmount(cartItems, method, index) {
        let stateTotalAmount = this.state.totalAmount;
        // console.log(cartItems.length);

        if (index!==null) {
            console.log(cartItems[index].prices);
            if (cartItems){
                for (let j = 0; j < cartItems[index].prices.length; j++) {
                    if (method === "onCartChangeIncrease") {
                        stateTotalAmount[j].amount += cartItems[index].prices[j].amount*2;
                    } else if (method === "onCartChangeDecrease") {
                        stateTotalAmount[j].amount -= cartItems[index].prices[j].amount*2;
                    }
                }
            }
        }else{
            if (cartItems) {
                for (let i = 0; i < cartItems.length; i++) {
                    for (let j = 0; j < cartItems[i].prices.length; j++) {
                        stateTotalAmount[j].amount += cartItems[i].prices[j].amount * cartItems[i].numberOfItems;
                    }
                }
            }
        }

        console.log(stateTotalAmount);
        this.setState({totalAmount: stateTotalAmount});
    }

    imageOnCarousel(gallery, index){
        return(
            <SideCarouselItem src={gallery[this.state.imageShowninCart[index]]} alt="img"  />
        )
    }

    
    changeCarouselImage(gallery, type, index) {
        gallery = gallery.slice(0,5);
        let imageShowninCart = this.state.imageShowninCart;
        if (type === "next") {
            if (imageShowninCart[index] < gallery.length - 1) {
                imageShowninCart[index]++;
            } else {
                imageShowninCart[index] = 0;
            }
        } else {
            if (imageShowninCart[index] > 0) {
                imageShowninCart[index]--;
            } else {
                imageShowninCart[index] = gallery.length - 1;
            }
        }
        this.setState({imageShowninCart: imageShowninCart});
    }

    ChangeLocalStorage(gallery, whatToChange, index) {
        let cartItems = localStorage.getItem('CartItems') ? JSON.parse(localStorage.getItem('CartItems')) : [];
        if (whatToChange === "numOfItemsIncrease") {
            cartItems[index].numberOfItems+= 1;
            localStorage.setItem('CartItems', JSON.stringify(cartItems));
            this.setState({cartitems: cartItems});
            this.SumAmount(cartItems, 'onCartChangeIncrease', index);
        } else if (whatToChange === "numOfItemsDecrease") {
            if (cartItems[index].numberOfItems > 1) {
                cartItems[index].numberOfItems-= 1;
                localStorage.setItem('CartItems', JSON.stringify(cartItems));
                this.setState({cartitems: cartItems});
                this.SumAmount(cartItems, 'onCartChangeDecrease', index);
            }

        }
        console.log(cartItems);
    }

    componentDidMount() {
        this.SumAmount(this.state.cartitems, 'normal', null);
    }

    render() {
        return (
            <div style={{marginLeft: '-10px'}}>
                <div>
                    <DropDown>
                        <DropDownHeader onClick={() => this.toggleDropdown(this.state.isOpen)}  >
                            <img style={{height: '22px', marginBottom: '-2px', marginRight: '0px'}} src={EmptyCart} alt="img" />
                            <div style={{display:'flex', justifyContent: 'center', alignItems: 'center', padding: '3px', background: '#000', color: '#fff', borderRadius: '100%', height: '14px', width: '14px', position: 'absolute', marginLeft: '12px', marginTop: '-15px', fontSize: '12px'}}>
                                {(this.state.cartitems.length > 0) && (
                                    <p style={{marginTop: '10px'}}>{this.state.cartitems.length}</p>
                                )}
                                {(this.state.cartitems.length === 0) && (
                                    <p style={{marginTop: '10px'}}>0</p>
                                )}
                            </div>
                        </DropDownHeader>
                        <DropDownBody className={`${this.isOpen && 'open'}`} dropdown={this.state.isOpen}>
                            {(this.state.cartitems.length > 0) && (
                                <div style={{marginBottom: '30px'}}><strong>My Bag</strong>: {this.state.cartitems.length} items</div>
                            )}
                            {(this.state.cartitems.length > 0) && (
                                <div>
                                    {this.state.cartitems.map((Cartitem, index) => {
                                        if (true){
                                            return (

                                                <div>
                                                    <Query query={LOAD_INDIVIDUAL_PRODUCT} variables={{"id": this.state.cartitems[index].uuid}}>
                                                        {({ error, loading, data }) => {
                                                            if (loading) return <p>Loading...</p>;
                                                            if (error) return <p>Error : {error}(</p>;
                                                            let ind_data = data.product
                                                            return(
                                                                <div>
                                                                    <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E5E5'}}>
                                                                        <div style={{padding: '5vh 0vh', borderBottom: '1px solid #E5E5E5', }}>
                                                                            <p style={{fontSize: '15px', fontWeight: '300', marginTop: '-35px'}} >{ind_data.brand}</p>
                                                                            <p style={{fontSize: '15px', fontWeight: '300', marginTop: '-12px'}}>{this.splitAndCapitalize(ind_data.id)}</p>
                                                                            <p style={{fontSize: '16px', fontWeight: '400', marginTop: '-6px', marginBottom: '-10px'}}>{this.props.currencyused} {ind_data.prices.find(i => i.currency.symbol === this.props.currencyused) ? ind_data.prices.find(i => i.currency.symbol === this.props.currencyused).amount : ''}</p>

                                                                            {ind_data.attributes.map((data, id) => 
                                                                                {
                                                                                    if (data.id==='Size') {
                                                                                        return(
                                                                                            <div>
                                                                                                <p style={{fontSize: '14px', fontWeight: '500', marginTop: '30px'}}>SIZE:</p>
                                                                                                <div style={{display: 'flex', marginTop: '-20px'}}>
                                                                                                    {data.items.map((item, id) =>
                                                                                                        {
                                                                                                            console.log(Cartitem);
                                                                                                            if (id === Cartitem.sizeChosen) {
                                                                                                                return(
                                                                                                                    <p style={{ fontSize: '13px', color: '#fff', background: '#000', padding: '0px 2px', border: '1px solid #000',  height: '22px', width: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '5px' }} onClick={() => this.setState({sizeChosen: id})}>{item.value}</p>
                                                                                                                )
                                                                                                                
                                                                                                            } else{
                                                                                                                return(
                                                                                                                    <p style={{ fontSize: '13px', padding: '0px 2px', border: '1px solid #000',  height: '22px', width: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '5px'}} onClick={() => this.setState({sizeChosen: id})}>{item.value}</p>
                                                                                                                )
                                                                                                            }
                                                                                                        }
                                                                                                    )}                                                        
                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                }
                                                                            )}


                                                                            {ind_data.attributes.map((data, id) => 
                                                                                {
                                                                                    if (data.id==='Capacity') {
                                                                                        return(
                                                                                            <div>
                                                                                                <p style={{fontSize: '14px', fontWeight: '800', marginTop: '40px'}}>CAPACITY:</p>
                                                                                                <div style={{display: 'flex', marginTop: '-20px'}}>
                                                                                                    {data.items.map((item, id) =>
                                                                                                        {
                                                                                                            if (item.value === Cartitem.capacityChosen) {
                                                                                                                return(
                                                                                                                    <p style={{padding: '3px', background: '#000', color: '#fff', border: '2px solid #000', fontSize: '13px', width: '30px', display: 'flex', justifyContent: 'center', marginRight: '10px'}} onClick={() => this.setState({capacityChosen: item.value})}>{item.value}</p>
                                                                                                                )
                                                                                                            }else {
                                                                                                                return(
                                                                                                                    <p style={{padding: '3px', border: '2px solid #000', fontSize: '13px', width: '30px', display: 'flex', justifyContent: 'center', marginRight: '10px'}} onClick={() => this.setState({capacityChosen: item.value})}>{item.value}</p>
                                                                                                                )
                                                                                                            }
                                                                                                        }
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                }
                                                                            )}


                                                                            {ind_data.attributes.map((data, id) => 
                                                                                {
                                                                                    if (data.id==='Color'){
                                                                                        return(
                                                                                            <div>
                                                                                                <p style={{fontSize: '14px', fontWeight: '800', marginTop: '20px'}}>COLOR:</p>
                                                                                                <div style={{display: 'flex', marginTop: '-5px'}}>
                                                                                                {data.items.map((item, id) =>
                                                                                                    {
                                                                                                        if (item.value === Cartitem.colorChosen) {
                                                                                                            return(
                                                                                                                <div style={{marginRight: '10px', outline: '3px solid #0F6450', display: 'flex', justifyContent: 'center'}} onClick={() => this.setState({colorChosen: item.value})} >
                                                                                                                    <div style={{ background: `${item.value}`, height: '15px', width: '15px'}}></div>
                                                                                                                </div>
                                                                                                            )
                                                                                                        }
                                                                                                        else{
                                                                                                            return(
                                                                                                                <div style={{marginRight: '10px', outline: '0.1px solid #000', display: 'flex', justifyContent: 'center'}} onClick={() => this.setState({colorChosen: item.value})} >
                                                                                                                    <div style={{ background: `${item.value}`, height: '15px', width: '15px'}}></div>
                                                                                                                </div>
                                                                                                            )
                                                                                                        }
                                                                                                    }
                                                                                                )}
                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                    } 
                                                                                }
                                                                            )}
                                                                            
                                                                            

                                                                        </div>
                                                                        <div style={{display: 'flex', marginTop: '4%', width: '40%'}}>
                                                                            <div style={{fontSize: '22px', marginRight: '5px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '2vh'}}>
                                                                                <div style={{fontSize: '40px', fontWeight: '200', border: '1px solid #000', width: '20px', height: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center'}} onClick={() => this.ChangeLocalStorage(ind_data.gallery, 'numOfItemsIncrease', index)}>+</div>
                                                                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px'}}><p>{this.state.cartitems[index].numberOfItems}</p></div>
                                                                                <div style={{fontSize: '40px', fontWeight: '200', border: '1px solid #000', width: '20px', height: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', }} onClick={() => this.ChangeLocalStorage(ind_data.gallery, 'numOfItemsDecrease', index)} >-</div>
                                                                            </div>
                                                                            <div style={{padding: '0vh 0vh 2vh 0vh'}}>
                                                                                {this.imageOnCarousel(ind_data.gallery, index)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }}
                                                    </Query>                        
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            )}
                            
                            {(this.state.cartitems.length > 0) && (
                                <div style={{marginTop: '-5px'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <p style={{fontSize: '17px'}}>Total: </p>
                                        <p><span style={{fontWeight: '800', }}>{this.props.currencyused} {this.state.totalAmount.find(i => i.currency.symbol === this.props.currencyused) ? Math.round(this.state.totalAmount.find(i => i.currency.symbol === this.props.currencyused).amount*100)/200 : ''}</span></p>
                                    </div>

                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <Link to='/mycart' style={{textDecoration: 'none', width: '100%'}} ><button style={{marginTop: '5px', textDecoration: 'none', background: '#5ECE7B', border: 'none', width: '99%', padding: '14px 15px', color: '#fff', fontWeight: '600'}}>VIEW  BAG</button></Link>
                                        <Link to='/mycart' style={{textDecoration: 'none', width: '100%'}} ><button style={{marginTop: '5px', textDecoration: 'none', background: '#fff', border: '2px solid #aaa', width: '99%', padding: '12px 15px', color: '#000', fontWeight: '600'}}>CHECK OUT</button> </Link>
                                    </div>

                                </div>
                            )}

                            {(this.state.cartitems.length === 0) && (
                                <div>
                                    The Cart is empty
                                </div>
                            )}

                            
                        </DropDownBody>
                    </DropDown>
                </div>


            </div>
        )
    }
}


const mapStateToProps = state => ({ 
    currencyused: state.currency,
    categoryin: state.categoryIn
});
export default connect(mapStateToProps)(MiniCartDropdown)


const DropDown = styled.div`
    // border-radius: 10px;
    // background-color: white;
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
    // display: block;
    background-color: white;
    padding: 20px;
    box-shadow: 0 10px 25px rgba(0,0,0,.1);
    z-index: 10;
    position: absolute;
    width: 21vw;
    margin-left: -20vw;

    :open {
        background: #FFFFFF;
        box-shadow: 0px 4px 35px rgba(168, 172, 176, 0.19);
    }

`


const SideCarouselItem = styled.img`
    box-shadow:inset 0px 0px 0px 10px #0ABBB3;
    width: 100%;
    height: 100%; 
    object-fit: cover; 
    object-position: 50% 50%; 
    // border-radius: 5px;

`