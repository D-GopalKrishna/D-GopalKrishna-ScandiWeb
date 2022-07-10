import React, { Component } from 'react'
import styled from "styled-components";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';

import EmptyCartWhite from "../assets/EmptyCartWhite.png";


import { Query } from "@apollo/client/react/components";
import { LOAD_CATEGORIES, LOAD_CATEGORY, LOAD_INDIVIDUAL_PRODUCT, LOAD_CURRENCY } from "../graphql/queries";


class Category extends Component {
    componentDidMount() {
    }

    splitAndCapitalize(word) {
        let splitWord = word.split("-");
        let capitalizedWord = splitWord.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(" ");
        return capitalizedWord;
    }

    capitalize() {
        return this.props.categoryin.charAt(0).toUpperCase() + this.props.categoryin.slice(1);
    }
    render() {
        return (
            <div>
                <h2 style={{marginTop: '5vh', fontWeight: '500', fontSize: '30px'}}>{this.capitalize()}</h2>

                <div style={{marginTop: '6vh', marginBottom: '20vh', marginLeft: '-8px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridGap: '30px', width: '100%'}}>
                    <Query query={LOAD_CATEGORIES}>
                        {({ error, loading, data }) => {
                            if (loading) return <p>Loading...</p>;
                            if (error) return <p>Error :(</p>;
                            console.log(data);
                            let categorySegment = data.categories.find(category => category.name === this.props.categoryin);
                            console.log(categorySegment);
                            return categorySegment.products.map(item => {
                                return (
                                    <CategoryIndiviudalItem className="">
                                        <Link to={`/details/${item.id}`} >
                                            <ImageItem src={item.gallery[0]} alt="img"  />
                                        </Link>
                                        <div>
                                            <div>
                                                <p style={{fontWeight: '300', marginBottom: '-10px'}}>{this.splitAndCapitalize(item.id)}</p>
                                                <p style={{fontWeight: '600'}}>{this.props.currencyused} {item.prices.find(i => i.currency.symbol === this.props.currencyused) ? item.prices.find(i => i.currency.symbol === this.props.currencyused).amount : ''}</p>
                                            </div>
                                            <div>
                                                <CartSign className="cartSign" >
                                                    <img style={{height: '20px', marginLeft: '-2px'}} src={EmptyCartWhite} alt="img" />
                                                </CartSign>
                                            </div>
                                        </div>
                                    </CategoryIndiviudalItem>
                                )
                            })
                        }}
                    </Query>
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => ({ 
    currencyused: state.currency,
    categoryin: state.categoryIn
});
export default connect(mapStateToProps)(Category);


const CategoryIndiviudalItem = styled.div`  
    display: flex;
    flex-direction: column;
    padding: 16px;
    // align-items: center;
    margin-bottom: 40px;
    position: relative;

    width: 350px;
    height: 410px; 

    :hover {
        background: #FFFFFF;
        box-shadow: 0px 4px 35px rgba(168, 172, 176, 0.19);
    }


    :hover > div > div > div  {
        opacity: 1;
    }

`

const ImageItem = styled.img`
    box-shadow:inset 0px 0px 0px 10px #0ABBB3;
    width: 350px;
    height: 340px; 
    object-fit: cover; 
    object-position: 50% 50%; 
    // border-radius: 5px;
`

const CartSign = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    background: #5ECE7B;
    border-radius: 100%;
    height: 18px;
    width: 18px;
    position: absolute;
    right: 10%;
    bottom: 15%;
    opacity: 0;
`