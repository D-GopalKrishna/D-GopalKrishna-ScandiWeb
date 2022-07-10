import { gql } from "@apollo/client";



export const LOAD_CATEGORIES = gql`
    query {
        categories {
            name
            products {
                id
                prices {
                    currency  {
                        label
                        symbol
                    }
                    amount
                }
                category
                description
                gallery
                attributes {
                    id
                    items {
                        id
                        value
                        displayValue
                    }
                    type
                }
                inStock
                brand
            }
        }
    }
`;


export const LOAD_CATEGORY = gql`
    query {
        category (input: $input) {
            name
            products {
                id
            }
        }
    }
`;


export const LOAD_INDIVIDUAL_PRODUCT = gql`
    query ($id: String!){
        product (id: $id){
            id
            prices {
                currency  {
                    label
                    symbol
                }
                amount
            }
            category
            description
            gallery
            attributes {
                id
                items {
                    id
                    value
                    displayValue
                }
                type
            }
            inStock
            brand
        }
    }
`;


export const LOAD_CURRENCY = gql`
    query {
        currencies {
            label
            symbol
        }
    }
`;