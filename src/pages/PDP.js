import React, { Component } from 'react'
import styled from "styled-components";
import parse from 'html-react-parser';
import { connect } from 'react-redux';
import { Link, Navigate } from "react-router-dom";


import { Query } from "@apollo/client/react/components";
import { LOAD_CATEGORIES, LOAD_CATEGORY, LOAD_INDIVIDUAL_PRODUCT, LOAD_CURRENCY } from "../graphql/queries";


class PDP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sizeChosen: null,
            colorChosen: null,
            capacityChosen: null,
            imageNumberVisible: 0,
        }
    }

    // componentDidMount() {
    //     this.setState({
    //         imageVisible: ''
    //     })
    // }

    splitAndCapitalize(word) {
        let splitWord = word.split("-");
        let capitalizedWord = splitWord.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(" ");
        return capitalizedWord;
    }

    primaryImageRender(gallery) {
        let primaryImage = gallery[this.state.imageNumberVisible];
        return (
            <MainImageItem src={primaryImage} alt="img" />
        )
    }

    changeImageNumberFunc(id) {
        this.setState({
            imageNumberVisible: id
        })
    }

    changeSizeChosen(id) {
        this.setState({
            sizeChosen: id
        })
    }

    AddTOCart(ind_data) {
        let attributes = ind_data.attributes;
        let sizeChosen, colorChosen, capacityChosen  = null;
        for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].id === "Size") {
                console.log(attributes[i]);
                if (this.state.sizeChosen === null) {
                    alert("Please select size");
                    return;
                }
                sizeChosen = this.state.sizeChosen;
            }else if (attributes[i].id === "Color") {
                if (this.state.colorChosen === null) {
                    alert("Please select color");
                    return;
                }
                colorChosen = this.state.colorChosen;
            }else if (attributes[i].id === "Capacity") {
                if (this.state.capacityChosen === null) {
                    alert("Please select capacity");
                    return;
                }
                capacityChosen = this.state.capacityChosen;
            }
        }

        let uuid = window.location.href.split('/')[4];
        let individualItem = {
            "uuid": uuid, 
            "sizeChosen": sizeChosen, 
            "colorChosen": colorChosen,
            "capacityChosen": capacityChosen,
            "numberOfItems": 1,
            "prices": ind_data.prices,
        }
        console.log(individualItem);
        let cartitems = localStorage.getItem('CartItems') ? JSON.parse(localStorage.getItem('CartItems')) : [];
        
        let itemExists = false;
        for (let i = 0; i < cartitems.length; i++) {
            if (cartitems[i].uuid === uuid) {
                itemExists = true;
                return alert("Item already in cart");
            }
        }
        if (!itemExists) {
            cartitems.push(individualItem);
            localStorage.setItem('CartItems', JSON.stringify(cartitems));
        }

    }


    render() {
        return (
        <div >
            <Query query={LOAD_INDIVIDUAL_PRODUCT} variables={{"id": window.location.href.split('/')[4]}}>
                {({ error, loading, data }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error : {}(</p>;
                    let ind_data = data.product
                    console.log(ind_data);
                    return(
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 4fr 3fr', marginTop: '6vh'}}>
                            <div>
                                {
                                    ind_data.gallery.map((image, id) => {
                                        if (id<5) {
                                            return(
                                                <ImageItemSidebar src={image} alt="img" onClick={() => this.changeImageNumberFunc(id)} />
                                            )
                                        }
                                    })
                                }
                            </div>
                            <div>
                                {/* <MainImageItem src= alt="img"  /> */}
                                {this.primaryImageRender(ind_data.gallery)}
                            </div>
                            <div>
                                <p style={{fontSize: '24px', fontWeight: '800', marginTop: '-12px'}} >{ind_data.brand}</p>
                                <p style={{fontSize: '26px', fontWeight: '400', marginTop: '-12px'}}>{this.splitAndCapitalize(ind_data.id)}</p>
                                <div>
                                    {ind_data.attributes.map((data, id) => 
                                        {
                                            if (data.id==='Size') {
                                                return(
                                                    <div>
                                                        <p style={{fontSize: '16px', fontWeight: '800', marginTop: '40px'}}>SIZE:</p>
                                                        <div style={{display: 'flex', marginTop: '-20px'}}>
                                                            {data.items.map((item, id) =>
                                                                {
                                                                    if (id === this.state.sizeChosen) {
                                                                        return(
                                                                            <p style={{padding: '8px', background: '#000', color: '#fff', border: '2px solid #000', width: '30px', display: 'flex', justifyContent: 'center', marginRight: '10px'}} onClick={() => this.setState({sizeChosen: id})}>{item.value}</p>
                                                                        )
                                                                        
                                                                    } else{
                                                                        return(
                                                                            <p style={{padding: '8px', border: '2px solid #000', width: '30px', display: 'flex', justifyContent: 'center', marginRight: '10px'}} onClick={() => this.setState({sizeChosen: id})}>{item.value}</p>
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
                                                        <p style={{fontSize: '16px', fontWeight: '800', marginTop: '20px'}}>COLOR:</p>
                                                        <div style={{display: 'flex', marginTop: '-5px'}}>
                                                        {data.items.map((item, id) =>
                                                            {
                                                                if (item.value === this.state.colorChosen) {
                                                                    return(
                                                                        <div style={{marginRight: '10px', outline: '3px solid #0F6450', display: 'flex', justifyContent: 'center'}} onClick={() => this.setState({colorChosen: item.value})} >
                                                                            <div style={{ background: `${item.value}`, height: '30px', width: '30px'}}></div>
                                                                        </div>
                                                                    )
                                                                }
                                                                else{
                                                                    return(
                                                                        <div style={{marginRight: '10px', outline: '0.1px solid #000', display: 'flex', justifyContent: 'center'}} onClick={() => this.setState({colorChosen: item.value})} >
                                                                            <div style={{ background: `${item.value}`, height: '30px', width: '30px'}}></div>
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
                                    
                                    {ind_data.attributes.map((data, id) => 
                                        {
                                            if (data.id==='Capacity') {
                                                return(
                                                    <div>
                                                        <p style={{fontSize: '16px', fontWeight: '800', marginTop: '40px'}}>CAPACITY:</p>
                                                        <div style={{display: 'flex', marginTop: '-20px'}}>
                                                            {data.items.map((item, id) =>
                                                                {
                                                                    if (item.value === this.state.capacityChosen) {
                                                                        return(
                                                                            <p style={{padding: '8px', background: '#000', color: '#fff', border: '2px solid #000', width: '40px', display: 'flex', justifyContent: 'center', marginRight: '10px'}} onClick={() => this.setState({capacityChosen: item.value})}>{item.value}</p>
                                                                        )
                                                                    }else {
                                                                        return(
                                                                            <p style={{padding: '8px', border: '2px solid #000', width: '40px', display: 'flex', justifyContent: 'center', marginRight: '10px'}} onClick={() => this.setState({capacityChosen: item.value})}>{item.value}</p>
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

                                <div style={{}}>
                                    <p style={{fontSize: '16px', fontWeight: '800', marginTop: '40px'}}>PRICE:</p>
                                    <p style={{fontSize: '22px', fontWeight: '800', marginTop: '-4px'}}>{this.props.currencyused} {ind_data.prices.find(i => i.currency.symbol === this.props.currencyused) ? ind_data.prices.find(i => i.currency.symbol === this.props.currencyused).amount : ''}</p>
                                </div>

                                <div>
                                    <Link to='/mycart' ><button style={{background: '#5ECE7B', border: 'none', width: '250px', padding: '15px', color: '#fff', fontWeight: '600'}} onClick={() => this.AddTOCart(ind_data)} >ADD TO CART</button></Link>
                                    <p style={{marginTop: '30px', width: '80%'}}>{parse(ind_data.description)}</p>
                                </div>
                            </div>
                        </div>
                    )           
                }}
            </Query>
        </div>
        )
    }
}


const mapStateToProps = state => ({ 
    currencyused: state.currency,
    categoryin: state.categoryIn
});
export default connect(mapStateToProps)(PDP)



const ImageItemSidebar = styled.img`
    box-shadow:inset 0px 0px 0px 10px #0ABBB3;
    width: 120px;
    height: 90px; 
    object-fit: cover; 
    object-position: 50% 50%; 
    // border-radius: 5px;
    margin-bottom: 20px;
`


const MainImageItem = styled.img`
    box-shadow:inset 0px 0px 0px 10px #0ABBB3;
    width: 40vw;
    height: 60vh; 
    object-fit: cover; 
    object-position: 50% 50%; 
    // border-radius: 5px;
`