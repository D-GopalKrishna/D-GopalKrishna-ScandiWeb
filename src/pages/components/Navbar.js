import React, { Component } from 'react'
import LogoImg from "../../assets/a-logo.png";
import { connect } from 'react-redux';
import { Link, useParams  } from "react-router-dom";

import styled from "styled-components";
import CurrencyDropdown from './smallcomponents/CurrencyDropdown';
import MiniCartDropdown from './smallcomponents/MiniCartDropdown';

import {categoryIn} from '../../state/action-creators/index';


class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sectionForPeople: this.props.categoryIn,
            // slug: 
        }
    }

    changeSectionForPeople(section) {
        this.setState({ sectionForPeople: section })
        this.props.changeCategory(section)
    }

    componentDidMount() {
        // this.setState({ slug: window.location.href.split('/')[3] })
        this.props.changeCategory(this.state.sectionForPeople)
    }
    componentDidUpdate() {
        // this.setState({ slug: window.location.href.split('/')[3] })

    }
    
    render() {        
        console.log(window.location.href.split('/')[3]);




        return (
            <div> 
                <nav style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',  marginTop: '8px'  }}>
                    <div style={{display: 'flex',}}>
                        {window.location.href.split('/')[3] === '' ?
                        <div style={{display: 'flex',}}>
                            <SectionForP onClick={() => this.changeSectionForPeople('all')} sectionForPeople={this.state.sectionForPeople} thisSection={'all'} >ALL</SectionForP>
                            <SectionForP onClick={() => this.changeSectionForPeople('tech')} sectionForPeople={this.state.sectionForPeople} thisSection={'tech'} >TECH</SectionForP>
                            <SectionForP onClick={() => this.changeSectionForPeople('clothes')} sectionForPeople={this.state.sectionForPeople} thisSection={'clothes'} >CLOTHING</SectionForP>
                        </div>                    
                        : 
                        <div style={{display: 'flex',}}>
                            <Link to='' ><SectionForP onClick={() => this.changeSectionForPeople('all')} sectionForPeople={this.state.sectionForPeople} thisSection={'rand'} style={{marginTop: '16px'}} >ALL</SectionForP></Link>
                            <Link to='' ><SectionForP onClick={() => this.changeSectionForPeople('all')} sectionForPeople={this.state.sectionForPeople} thisSection={'rand'} style={{marginTop: '16px'}} >TECH</SectionForP></Link>
                            <Link to='' ><SectionForP onClick={() => this.changeSectionForPeople('all')} sectionForPeople={this.state.sectionForPeople} thisSection={'rand'} style={{marginTop: '16px'}} >CLOTHING</SectionForP></Link>
                            
                        </div>
                        
                        
                        }
                    </div>
                    <div style={{marginLeft: '-12vw'}}>
                        <Link to='' onClick={() => this.changeSectionForPeople('all')} sectionForPeople={this.state.sectionForPeople} thisSection={'rand'} ><img style={{height: '36px', marginTop: '10px'}} src={LogoImg} alt="img" /></Link>
                    </div>

                    <div style={{display: 'flex'}}>
                        <CurrencyDropdown />
                        <MiniCartDropdown />
                    </div>


                </nav>
            </div>
        )
    }
}


const mapStateToProps = state => ({ categoryIn: state.categoryIn })
const mapDispatchToProps = dispatch => {
    return {
        changeCategory: (section) => { // handles onTodoClick prop's call here
            dispatch(categoryIn(section))
        }       
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

const SectionForP = styled.button`
    color: #000;
    padding-right: 10px;
    padding-left: 10px;
    margin-right: 5px;
    margin-left: 5px;
    border: none;
    background: #fff;
    font-weight: 500;

    ${({ sectionForPeople, thisSection }) => sectionForPeople===thisSection && `
        color: #5ECE7B;
        border-bottom: 2px solid #5ECE7B;
        underline-color: #5ECE7B;
        font-weight: 600;
    `}
`

