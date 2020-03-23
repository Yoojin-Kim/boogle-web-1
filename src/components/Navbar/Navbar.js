import React, { Component } from "react";

import "./Navbar.css";
import "../Sell/Register.css";

import { withRouter, Link } from "react-router-dom";

import { Col, Row, Carousel } from "antd";
import Search from "./Search";


class Navbar extends Component {
  state = {
    signUpToggle: false,
    form: null,
    modal1Visible: false,
    modal2Visible: false,

    userNav: null,
    tokenValue: "",
    nameValue: "",
    isLogIn: false,

    afterLogin: null,
    fetchState: false,

    loginState: 0,

    afterScrolled: "before-scrolled",
    isFocused: false,
    mode: "buy"
  };

  focusOnSearch = isFocused => {
    this.setState({ isFocused: isFocused });
    this.setState({ isFocusedClass: "isFocused" });
    this.props.focusOnSearch(isFocused);
  };

  updateInputValue = resdata => {
    this.props.updateInputValue(resdata);
  };

  changeMode = (mode) => {
    this.props.changeMode(mode);
  }

  changeIsAlarmNeedSectionAppened = (isAlarmNeedSectionAppened) => {
    this.props.changeIsAlarmNeedSectionAppened(false);
  }

  render() {

    return (
        <div id={this.state.mode === "buy" ? "navbar" : "navbar-sell"}>
          {this.state.isFocused === true || this.props.renderFocus === true ? (
              <header>
                <Row id="navbar-search-row-after-focused">
                  <Col style={{marginRight : "10px", paddingTop : "1px"}} xs={{ offset : 1, span: 2 }}>
                    <img style={{
                      width: "100%",
                      height: "auto",
                      filter: "brightness(0) invert(1)"
                    }}
                         onClick={() => {
                           this.setState({ isFocused: false });
                           this.setState({ isFocusedClass: "" });
                           this.props.unFocusOnSearch();
                           this.updateInputValue(null);
                           this.props.changeIsAlarmNeedSectionAppened(false);
                           this.props.reRenderFocus();
                         }}
                         src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/left_arrow.png" />
                  </Col>
                  <Col xs={{ span: 17, offset: 0 }}>
                    <Search
                        focusOnSearch={this.focusOnSearch}
                        updateInputValue={this.updateInputValue}
                        mode={this.state.mode}
                        sortType1 = {this.props.sortType1}
                        sortType2 = {this.props.sortType2}
                        sellSortType = {this.props.sellSortType}
                        searchType = {this.props.searchType}
                        placeHolder={this.state.mode === "buy" ?
                            "구매할 도서의 제목, 저자 또는 ISBN을 입력해주세요."
                            : "판매할 도서의 제목, 저자 또는 ISBN을 입력해주세요."}
                    ></Search>
                  </Col>
                  <Col style={{marginLeft : "10px", paddingTop : "1px"}} xs={{ offset : 0, span: 2 }}>
                    <img style={{
                      width: "100%",
                      height: "auto",
                      filter: "brightness(0) invert(1)"
                    }}
                         onClick={() => {
                         }}
                         src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/filter.png" />
                  </Col>
                </Row>
              </header>
          ) : (
              <div>
                <header id="navbar-fixed">
                  <Row id="navbar-top-row">
                    <Col xs={{ span: 4, offset: 2 }}>
                      <img
                          style={{ width: "6.0vh", height: "auto" }}
                          src="https://s3.ap-northeast-2.amazonaws.com/boogle.shop/logo.png"
                          onClick={() => { window.location.reload() }}
                      ></img>
                    </Col>
                    <Col xs={{ span: 4, offset: 0 }}>
                      <button
                          className={this.state.mode === "sell" ? "mode-button-active" : "mode-button"}
                          style={{
                            width: "100%",
                            border: "#ffffff 1px solid",
                            borderRight: "none",
                            borderTopLeftRadius: "12px",
                            borderBottomLeftRadius: "12px",
                            borderTopRightRadius: "0px",
                            borderBottomRightRadius: "0px",
                            fontSize: "11px",
                            height: "30px",
                            marginTop: "7.5%"
                          }}
                          onClick={() => {
                            if (this.state.mode == "buy") {
                              this.changeMode("sell");
                              this.setState({ mode: "sell" });
                            }
                          }
                          }>판매하기</button>
                    </Col>
                    <Col xs={{ span: 4, offset: 0 }}>
                      <button
                          className={this.state.mode === "buy" ? "mode-button-active" : "mode-button"}
                          style={{
                            width: "100%",
                            border: "#ffffff 1px solid",
                            borderLeft: "none",
                            borderTopRightRadius: "12px",
                            borderBottomRightRadius: "12px",
                            borderTopLeftRadius: "0px",
                            borderBottomLeftRadius: "0px",
                            fontSize: "11px",
                            height: "30px",
                            marginTop: "7.5%"
                          }}
                          onClick={() => {
                            if (this.state.mode = "sell") {
                              this.changeMode("buy");
                              this.setState({ mode: "buy" });
                            }
                          }}>구매하기</button>
                    </Col>
                    <Col xs={{ span: 1, offset: 6 }}>
                      <Link to="/signin">
                        <img style={{
                          width: "22px",
                          height: "auto",
                          marginTop: "9px",
                          marginLeft: "2px"
                        }}
                             onClick={() => {
                             }}
                             src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/user_icon.png" />
                      </Link>
                    </Col>
                  </Row>
                  {this.state.mode === "buy" ?
                      <Row id="navbar-search-row">
                        <Col xs={{ span: 20, offset: 2 }}>
                          <Search
                              focusOnSearch={this.focusOnSearch}
                              placeHolder={this.state.mode === "buy" ?
                                  "구매할 도서의 제목, 저자 또는 ISBN을 입력해주세요."
                                  : "판매할 도서의 제목, 저자 또는 ISBN을 입력해주세요."}
                              mode={this.state.mode}
                              sellSortType = {this.props.sellSortType}
                          ></Search>
                        </Col>
                      </Row>
                      : null
                  }
                </header>
                {
                  this.state.mode === "buy" ?
                      <header id="navbar-unfixed">
                        <Row>
                          <Col xs={{ span: 20, offset: 2 }}>
                            <Carousel className="navbar-carousel" autoplay>
                              <a href="https://www.notion.so/boogle/3bbbb6ce5b554209ac14c900dba8ea88">
                                <div className="navbar-carousel-div">
                                  <h3 className="navbar-carousel-title">북을박스가 뭐야? </h3>
                                  <h3 className="navbar-carousel-title">
                                    궁금하면
                                  </h3>
                                  <h3 className="navbar-carousel-title"> Click!</h3>
                                </div>
                                <div style={{textAlign : "right", marginTop : "0px"}}>
                                  <span style={{color : "white"}}>더보기 >></span>
                                </div>
                              </a>
                              <a href="https://www.notion.so/boogle/EVENT-c4fda36c9ed24dd3b78cfce32f8e8a2c">
                                <div className="navbar-carousel-div">
                                  <h3 className="navbar-carousel-title">판매 등록 시, </h3>
                                  <h3 className="navbar-carousel-title">
                                    30% 선 지급 이벤트
                                  </h3>
                                  <h3 className="navbar-carousel-title">진행 중!</h3>
                                </div>
                                <div style={{textAlign : "right", marginTop : "0px"}}>
                                  <span style={{color : "white"}}>더보기 >></span>
                                </div>
                              </a>
                              <a href="https://www.notion.so/boogle/EVENT-c4fda36c9ed24dd3b78cfce32f8e8a2c">
                                <div className="navbar-carousel-div">
                                  <h3 className="navbar-carousel-title">새내기 섹션 이벤트! </h3>
                                  <h3 className="navbar-carousel-title">회원가입하고 </h3>
                                  <h3 className="navbar-carousel-title">동기들과 치킨먹자! </h3>
                                </div>
                                <div style={{textAlign : "right", marginTop : "0px"}}>
                                  <span style={{color : "white"}}>더보기 >></span>
                                </div>
                              </a>
                            </Carousel>
                          </Col>
                        </Row>
                      </header> : null}

              </div>
          )}
        </div>
    );
  }
}

export default withRouter(Navbar);