import React, { Component } from 'react'
import styled from "styled-components";
import { connect } from 'react-redux';


import { Query } from "@apollo/client/react/components";
import { LOAD_CATEGORIES, LOAD_CATEGORY, LOAD_INDIVIDUAL_PRODUCT, LOAD_CURRENCY } from "../graphql/queries";


class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartitems: localStorage.getItem('CartItems') ? JSON.parse(localStorage.getItem('CartItems')) : [],
            imageShowninCart: Array(JSON.parse(localStorage.getItem('CartItems')).length).fill(0),
            totalAmount: [
                { currency: { label: "USD", symbol: "$" }, amount: 0 }, 
                { currency: { label: "GBP", symbol: "£" }, amount: 0 }, 
                { currency: { label: "AUD", symbol: "A$" }, amount: 0 }, 
                { currency: { label: "JPY", symbol: "¥" }, amount: 0 },  
                { currency: { label: "RUB", symbol: "₽" }, amount: 0 }, 
            ]
        }
    }


    splitAndCapitalize(word) {
        let splitWord = word.split("-");
        let capitalizedWord = splitWord.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(" ");
        return capitalizedWord;
    }

    SumAmount(cartItems, method, index) {
        let stateTotalAmount = this.state.totalAmount;
        // console.log(cartItems.length);

        if (index!==null) {
            console.log(cartItems[index].prices);
            for (let j = 0; j < cartItems[index].prices.length; j++) {
                if (method === "onCartChangeIncrease") {
                    stateTotalAmount[j].amount += cartItems[index].prices[j].amount*2;
                } else if (method === "onCartChangeDecrease") {
                    stateTotalAmount[j].amount -= cartItems[index].prices[j].amount*2;
                }
            }
        }else{
            for (let i = 0; i < cartItems.length; i++) {
                for (let j = 0; j < cartItems[i].prices.length; j++) {
                    stateTotalAmount[j].amount += cartItems[i].prices[j].amount * cartItems[i].numberOfItems;
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
        console.log(this.state.imageShowninCart);
    }

    render() {
        return (
            <div style={{marginBottom: '30vh'}}>
                <p style={{fontSize: '28px', fontWeight: '800', marginTop: '6vh'}} >CART</p>
                <p style={{borderBottom:  '1px solid #E5E5E5'}} />
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
                                                        <div style={{padding: '5vh 0vh', borderBottom: '1px solid #E5E5E5'}}>
                                                            <p style={{fontSize: '22px', fontWeight: '800', marginTop: '-12px'}} >{ind_data.brand}</p>
                                                            <p style={{fontSize: '24px', fontWeight: '400', marginTop: '-12px'}}>{this.splitAndCapitalize(ind_data.id)}</p>
                                                            <p style={{fontSize: '18px', fontWeight: '800', marginTop: '-6px', marginBottom: '35px'}}>{this.props.currencyused} {ind_data.prices.find(i => i.currency.symbol === this.props.currencyused) ? ind_data.prices.find(i => i.currency.symbol === this.props.currencyused).amount : ''}</p>

                                                            {ind_data.attributes.map((data, id) => 
                                                                {
                                                                    if (data.id==='Size') {
                                                                        return(
                                                                            <div>
                                                                                <p style={{fontSize: '14px', fontWeight: '800', marginTop: '40px'}}>SIZE:</p>
                                                                                <div style={{display: 'flex', marginTop: '-20px'}}>
                                                                                    {data.items.map((item, id) =>
                                                                                        {
                                                                                            console.log(Cartitem);
                                                                                            if (id === Cartitem.sizeChosen) {
                                                                                                return(
                                                                                                    <p style={{ background: '#000', color: '#fff', border: '2px solid #000', fontSize: '15px', width: '22px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4px', marginRight: '10px'}} onClick={() => this.setState({sizeChosen: id})}>{item.value}</p>
                                                                                                )
                                                                                                
                                                                                            } else{
                                                                                                return(
                                                                                                    <p style={{ border: '2px solid #000', fontSize: '15px', width: '22px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4px', marginRight: '10px'}} onClick={() => this.setState({sizeChosen: id})}>{item.value}</p>
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
                                                                                                    <p style={{padding: '6px', background: '#000', color: '#fff', border: '2px solid #000', fontSize: '14px', width: '30px', display: 'flex', justifyContent: 'center', marginRight: '10px'}} onClick={() => this.setState({capacityChosen: item.value})}>{item.value}</p>
                                                                                                )
                                                                                            }else {
                                                                                                return(
                                                                                                    <p style={{padding: '6px', border: '2px solid #000', fontSize: '14px', width: '30px', display: 'flex', justifyContent: 'center', marginRight: '10px'}} onClick={() => this.setState({capacityChosen: item.value})}>{item.value}</p>
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
                                                                                                    <div style={{ background: `${item.value}`, height: '22px', width: '22px'}}></div>
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                        else{
                                                                                            return(
                                                                                                <div style={{marginRight: '10px', outline: '0.1px solid #000', display: 'flex', justifyContent: 'center'}} onClick={() => this.setState({colorChosen: item.value})} >
                                                                                                    <div style={{ background: `${item.value}`, height: '22px', width: '22px'}}></div>
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
                                                        <div style={{display: 'flex'}}>
                                                            <div style={{fontSize: '22px', marginRight: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '2vh'}}>
                                                                <div style={{fontSize: '40px', fontWeight: '200', border: '1px solid #000', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center'}} onClick={() => this.ChangeLocalStorage(ind_data.gallery, 'numOfItemsIncrease', index)}>+</div>
                                                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><p>{this.state.cartitems[index].numberOfItems}</p></div>
                                                                <div style={{fontSize: '40px', fontWeight: '200', border: '1px solid #000', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', }} onClick={() => this.ChangeLocalStorage(ind_data.gallery, 'numOfItemsDecrease', index)} >-</div>
                                                            </div>
                                                            <div style={{padding: '0vh 0vh 2vh 0vh'}}>
                                                                {this.imageOnCarousel(ind_data.gallery, index)}
                                                                <div style={{position: 'relative'}}>
                                                                    <div style={{display: 'flex', position: 'absolute', marginTop: '-5vh', right: '6%'}}>
                                                                        <div style={{color: '#fff', background: 'rgba(0,0,0,0.7)', width: '20px', display: 'flex', justifyContent: 'center', padding: '5px', marginRight: '10px', transform: "rotate(180deg)"}} onClick={() => this.changeCarouselImage(ind_data.gallery, 'next', index)} >
                                                                            >
                                                                        </div>
                                                                        <div style={{color: '#fff', background: 'rgba(0,0,0,0.7)', width: '20px', display: 'flex', justifyContent: 'center', padding: '5px'}} onClick={() => this.changeCarouselImage(ind_data.gallery, 'prev', index)} >
                                                                            >
                                                                        </div>
                                                                    </div>
                                                                </div>    
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

                        <p style={{fontSize: '17px', marginBottom: '-5px'}}>Tax 21%: <span style={{fontWeight: '800', marginLeft: '10px' }}>{this.props.currencyused} {this.state.totalAmount.find(i => i.currency.symbol === this.props.currencyused) ? Math.round(this.state.totalAmount.find(i => i.currency.symbol === this.props.currencyused).amount*21)/200 : ''}</span></p>
                        <p style={{fontSize: '17px', marginBottom: '-5px'}}>Quantity: <span style={{fontWeight: '800', marginLeft: '10px' }}>{this.state.cartitems.length}</span></p>
                        <p style={{fontSize: '17px'}}>Total: <span style={{fontWeight: '800', marginLeft: '10px' }}>{this.props.currencyused} {this.state.totalAmount.find(i => i.currency.symbol === this.props.currencyused) ? Math.round(Math.round(this.state.totalAmount.find(i => i.currency.symbol === this.props.currencyused).amount*21)/2 + Math.round(this.state.totalAmount.find(i => i.currency.symbol === this.props.currencyused).amount*100)/2)/100 : ''}</span></p>

                        <button style={{marginTop: '5px', background: '#5ECE7B', border: 'none', width: '250px', padding: '15px', color: '#fff', fontWeight: '600'}}>ADD TO CART</button>


            </div>
        )
    }
}


const mapStateToProps = state => ({ 
    currencyused: state.currency,
    categoryin: state.categoryIn
});
export default connect(mapStateToProps)(Cart)


const SideCarouselItem = styled.img`
    box-shadow:inset 0px 0px 0px 10px #0ABBB3;
    width: 15vw;
    height: 100%; 
    object-fit: cover; 
    object-position: 50% 50%; 
    // border-radius: 5px;
`