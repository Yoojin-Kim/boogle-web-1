import React, { useState } from 'react';
import useForm from 'react-hook-form';
import { Modal, Button, Col, Row, Icon } from 'antd';
import { useHistory, withRouter, Link } from "react-router-dom";
import axios from 'axios';

import './Search.css';


export default function Search(props,{ location, match, history }) {

  const [inputValue, setInputValue] = useState();
  const [resdata, setResdata] = useState();
  const [searchType, setSearchType] = useState("");
  const [onFocus, setOnFocus] = useState("");
  const [onBlur, setOnBlur] = useState("");

  const updateInputValue = (e) => {

    if(searchType === "/sell"){
      getAllSearchedSellItems(e.target.value);
    }
    else{
      getAllSearchedBuyItems(e.target.value);
    }    
  }

  const getAllSearchedBuyItems = async (keyword) => {
    if(isNaN(keyword) || (!isNaN(keyword) && keyword.length < 4)){
      axios.get('http://13.124.113.72:8080/naver/bookApi/buy/title?keyword=' + keyword)
      .then((response) => {

        console.log(response);
        console.log(keyword);

        if(response.data != null){

          const items = response.data;
          
          if(items!== undefined && items.length > 0 && keyword !==''){
            setResdata(items);
          }

          if(keyword === ''){
              setResdata(null);
          }

          }
        }
      );
    }
    else{
      axios.get('http://13.124.113.72:8080/naver/bookApi/buy/isbn?keyword=' + keyword)
      .then((response) => {

        console.log(response);
        console.log(keyword);

        if(response.data != null){

          const items = response.data;
          
          if(items!== undefined && items.length > 0 && keyword !==''){
            setResdata(items);
          }

          if(keyword === ''){
              setResdata(null);
          }

          }
        }
      );
    }

  }

  const getAllSearchedSellItems = async (keyword) => {
    
    if(isNaN(keyword) || (!isNaN(keyword) && keyword.length < 4)){

      axios.get('http://13.124.113.72:8080/naver/bookApi/sell/title?keyword=' + keyword)
      .then((response) => {
        console.log(response);
        if(response.data != null){

          const items = response.data;
          
          if(items!== undefined && items.length > 0 && keyword !==''){
            setResdata(items);
          }

          if(keyword === ''){
              setResdata(null);
          }

          props.updateInputValue(resdata);

          }
      }
      );
    }
    else{
      axios.get('http://13.124.113.72:8080/naver/bookApi/sell/isbn?keyword=' + keyword)
      .then((response) => {
        console.log(response);
        if(response.data != null){

          const items = response.data;
          
          if(items!== undefined && items.length > 0 && keyword !==''){
            setResdata(items);
          }

          if(keyword === ''){
              setResdata(null);
          }

          props.updateInputValue(resdata);

          }
      }
      );
    }
    
  }

  const onFocusHandler = () =>{
    setOnFocus("search-result-col");
    props.focusOnSearch(true);  
  }

  const onBlurHandler = () => {
    setOnBlur("search-result-col-before-focus");
  }

    React.useEffect(() => {
      setSearchType(window.location.pathname);
    }, [])

    React.useEffect(() => {
      if(resdata != null){
        console.log(resdata);
        props.updateInputValue(resdata);
      }
    }, [resdata])
      return (
        <form className="search-form">
          <input onFocus={onFocusHandler} onBlur={onBlurHandler}
           className="search-input" type="text" name="name"
            value={inputValue}
            onChange={evt => updateInputValue(evt)}
            onKeyPress = {(e) => {
              if(e.key = 'Enter'){
                e.preventDefault();
                e.target.blur();
            }}}
            placeholder={props.placeHolder} />
          <Icon className="search-input-button" type="search" theme="outlined" style={{ color: "white", margin: "auto" }}></Icon>
        </form>
      );
}