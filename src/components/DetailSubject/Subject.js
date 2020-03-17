import React, { useState, useEffect } from "react";
// import styled from "styled-components";
import {Col, Row, Icon, Divider, Popconfirm, message, Tag, Modal, Rate} from "antd";
import { Link, RouteComponentProps, Redirect, useHistory } from "react-router-dom";
import axios from "axios";
import NumberFormat from "react-number-format";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Subject.css";
import host from '../../server-settings/ServerApiHost';

function Subject({ match }) {
  //const [id, setId] = useState("5e2d39aa3eb3ee04d828414d");
  const [id, setId] = useState("");
  const [item, setItem] = useState({});
  const [seller, setSeller] = useState({});
  const [isBookmarked, setIsBookmarked] = useState(0);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [confirmModalOpened, setConfirmModalOpened] = useState(false);

  const [isMySellItem, setIsMySellItem] = useState(false);
  const [paybackedSellItem, setPaybackedSellItem] = useState(false);

  const [qualityScore, setQualityScore] = useState(-1);

  const authToken =
    localStorage.getItem("token") == null ? "" : localStorage.getItem("token");
  const server_url = host;
  const detail_sub_url = `${server_url}/sell/detail?id=${id}`;
  const bookmark_url = `${server_url}/bookmark?sellItemId=${id}`;
  const transaction_url = `${server_url}/transaction`;

  const qualityExtraNameList = ["긁힘/접힘", "밑줄", "문제 풂", "이름 기입", "젖음", "찢어짐", "필기", "기타 오염"];

  useEffect(() => {
    if (
      localStorage.getItem("token") != "" &&
      localStorage.getItem("token") != null
    ) {
      setIsSignedIn(true);
    } else {
      setIsSignedIn(false);
    }
  }, []);

  useEffect(() => {
    const id = window.location.pathname.substring(12);
    setId(id);
  }, []);

  useEffect(() => {
    if (id != "") {
      const getItemData = async () => {
        const result = await axios.get(detail_sub_url, {
          headers: { Authorization: authToken }
        });

        // console.log(result.data.data);
        // 로그인 인증 정보 보내기. 에러 처리 필요

        setItem(result.data.data.sellItem);
        setSeller(result.data.data.sellerUser);
        setIsBookmarked(result.data.data.bookmarked);

        let qualityExtraList = result.data.data.sellItem.qualityExtraList;
        let newQualityExtraList = [];

        const scoreAppliedQualityIndexArray = [0,3,4,5,7];

        scoreAppliedQualityIndexArray.forEach(s => newQualityExtraList.push(qualityExtraList[s]))

        let score = 5;
        newQualityExtraList.forEach(q => {
            if(q){score--;}
        })

        setQualityScore(score);

        axios.get(host + "/users/comparison?userId="
            + result.data.data.sellItem.sellerId, {
            headers: { Authorization: authToken }
        }).then((response)=>{

            if(response.data.data === true) {
                setIsMySellItem(true);
            }
            else {
                axios.get(host + "/sell/payback?sellItemId="
                    + result.data.data.sellItem._id, {
                    headers: { Authorization: authToken }
                }).then((response)=>{
                    if(response.data.data === true) {
                        setIsMySellItem(false);
                        setPaybackedSellItem(true);
                    }
                    else{
                        setIsMySellItem(false);
                        setPaybackedSellItem(false);
                    }
                })
            }
        })
      };

      getItemData();
    }
  }, [id]);

  const dateFormat = rawDate => {
    const date = rawDate.slice(0, 10).split("-");
    return `${date[0]}.${date[1]}.${date[2]}`;
  };
  const qualDisplay = (qualityGeneral, qualityExtraList) => {

    return (
      <Row>
        <Row>
          <Col xs={{ offset: 1, span: 22 }}>
            <Tag color="#656565">책 상태</Tag>
            <Tag color="#44a0ac">
              {
                qualityGeneral == "CLEAN" ? "깨끗"
                  : qualityGeneral == "ALMOST_CLEAN" ? "대체로 깨끗"
                    : qualityGeneral == "USED" ? "사용감 많음"
                      : null
              }
            </Tag>
          </Col>
        </Row>
        <Row>
          <Col xs={{ offset: 1, span: 22 }}>
            <Tag color="#656565">기타</Tag>
            {qualityExtraList.map((val, i) => {
              return val === true ? <Tag color="#44a0ac">{qualityExtraNameList[i]}</Tag> : null;
            })}
          </Col>
        </Row>
      </Row>
    );
  };

  const confirm = e => {
    message.success("구매 신청이 완료되었습니다.");
    const buyReq = {
      sellItemId: id,
      sellerId: seller.id,
      transactionType: item.dealType,
      sellerStep: 0,
      buyerStep: 0,
      boxId: "",
      boxPassword: "",
      isPaymentDone: false
    };
    axios.post(transaction_url, buyReq, {
      headers: { Authorization: authToken }
    });
  };

    const cancelSellItem = (sellItemId) => {
        message.success("판매 등록이 취소되었습니다.");
        axios.delete(host + "/sell?sellItemId=" + sellItemId, {
            headers: { Authorization: authToken }
        });
    };

  const updateBookmark = isBookmarked => {
    isBookmarked = setIsBookmarked(!isBookmarked);
    axios
      .get(bookmark_url, {
        headers: { Authorization: authToken }
      })
      .then(res => console.log(res));
  };

  const history = useHistory();
  const goToSignIn = () => {
      if (authToken != "" && authToken != null) {
          history.push('/signin')
      }
  };

    const goToHome = () => {
        if (authToken != "" && authToken != null) {
            history.push('/')
        }
    };

  return (
    <div id="subject-container">
      <Row
        style={{
          top: 20,
          left: 0,
          zIndex: 100,
          backgroundColor: "RGBA(255,255,255,0.0)"
        }}
      >
        <Col xs={{ span: 2, offset: 1 }}>
          <Link to="/">
            <img
              style={{
                width: "32px",
                height: "auto",
                marginLeft: "40%",
                filter: "brightness(0) invert(1)"
              }}
              src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/left_arrow.png"
            />
          </Link>
        </Col>
        <Col xs={{ span: 1, offset: 17 }}>
          <Icon
            type="heart"
            theme={isBookmarked == 1 ? "filled" : "outlined"}
            style={{ color: "white", fontSize: "4vh" }}
            onClick={() => {
              return authToken != "" ? updateBookmark(isBookmarked) : null;
            }}
          />
        </Col>
      </Row>
      <Row style={{ top: -27 }}>
        <Col xs={{ span: 24 }} style={{}}>
          <Carousel showThumbs={false}>
            {item.regiImageUrlList != undefined
              ? item.regiImageUrlList.map((imgUrl, i) => {
                return (
                  <div style={{ margin: "auto" }}>
                    <img
                      style={{
                        width: "100%",
                        height: "30vh",
                        objectFit: "contain",
                        margin: "auto"
                      }}
                      src={imgUrl}
                    ></img>
                  </div>
                );
              })
              : null}
          </Carousel>
        </Col>
      </Row>

      <Row style={{ marginTop: "0vh" }}>
        <Row>
          <Col xs={{ span: 22, offset: 1 }}>
            <h1
              style={{ fontSize: "3.5vh", color: "#656565", fontWeight: "500" }}
            >
              {item.title}
            </h1>
          </Col>
        </Row>
        <Row>
          <Row>
            <Col style={{ marginBottom: "-1vh" }} xs={{ span: 22, offset: 1 }}>
              <h2 style={{ fontSize: "1.75vh", color: "#656565" }}>
                {item.author}
              </h2>
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 22, offset: 1 }}>
              <h3 style={{ fontSize: "1.75vh", color: "#656565" }}>
                {item.publisher}
              </h3>
            </Col>
          </Row>
        </Row>
        <Row style={{ marginTop: "1.25vh" }}>
          <Row>
            <Col xs={{ span: 22, offset: 1 }}>
              <span
                style={{
                  fontSize: "1.75vh",
                  color: "#656565",
                  textDecoration: "line-through"
                }}
              >
                정가 :
                <NumberFormat
                  value={item.price}
                  displayType={"text"}
                  thousandSeparator={true}
                />
                원
              </span>
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 22, offset: 1 }}>
              <span
                style={{
                  fontSize: "2.75vh",
                  color: "#44a0ac",
                  fontWeight: "600"
                }}
              >
                북을 판매가 :{" "}
                <NumberFormat
                  value={item.regiPrice}
                  displayType={"text"}
                  thousandSeparator={true}
                />
                원
              </span>
            </Col>
          </Row>
        </Row>
      </Row>
      <Row>
        <Col>
          <Divider style={{ background: "lightgray" }} />
        </Col>
      </Row>
      <Row>
        <Col xs={{ span: 2, offset: 1 }}>
          <Icon
            style={{
              color: "#44a0ac",
              fontSize: "6vh",
              fontWeight: "200"
            }}
            type="question-circle"
            id="profile-circle"
          />
        </Col>
        {/* 아직 셀러 정보 조회 API 없음 */}
        <Col style={{}} xs={{ span: 10, offset: 1 }}>
          <Row>
            <Col>
              <span style={{ fontSize: "2.25vh", color: "#656565" }}>
                {seller.nickname}
              </span>
            </Col>
            <Col style={{ marginTop: "-1vh" }}>
              <span style={{ fontSize: "1.7vh", color: "#656565" }}>
                {seller.campus}
              </span>
            </Col>
          </Row>
        </Col>
        <Col xs={{ span: 7, offset: 2 }}>
          <Link>
            <span style={{ fontSize: "1.7vh", color: "#656565" }}>
                {/*판매자 정보 더보기*/}
            </span>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <Divider style={{ background: "lightgray" }} />
        </Col>
      </Row>
        {qualityScore > -1 ?
            <Row>
                <Col>
                    <Row style={{marginBottom : "2.5px"}}>
                        <Col xs={{ span: 23, offset: 1 }}>
              <span style={{ fontSize: "2vh", color: "#656565" }}>
                  <Rate style={{
                      color: "rgba(51, 158, 172, 0.9)",
                      fontSize: "2vh", textAlign: "center"
                  }} disabled defaultValue={qualityScore} />  {"  |  "}
                  {item.regiTime != undefined ? dateFormat(item.regiTime) : null}
                  {item.dealType == 0 ? "  |  직거래 " : "  |  북을박스"}
              </span>
                        </Col>
                    </Row>
                    {item.qualityGeneral != undefined && item.qualityExtraList != undefined
                        ? qualDisplay(item.qualityGeneral, item.qualityExtraList)
                        : null}
                </Col>
            </Row> : null
        }

      <Row style={{ marginTop: "4vh", marginBottom: "3vh" }}>
        <Col xs={{ span: 22, offset: 1 }}>
          <textarea
            readOnly
            style={{
              width: "100%",
              height: "80px",
              border: "#656565 solid 0.3px",
              borderRadius: "5px",
              color: "transparent",
              textShadow: "0 0 0 #656565"
            }}
            value={item.comment}
          />
        </Col>
      </Row>
      <Row style={{ marginBottom: "15vh" }}>
        <Col xs={{ offset: 1, span: 22 }}>
          {localStorage.getItem('token') != null ?
              <div>
                  <button
                      style={{
                          padding: "0",
                          width: "100%",
                          background: "rgba(51, 158, 172, 0.9)",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "2.25vh",
                          fontSize: "2.5vh",
                          height: "5vh"
                      }}
                      onClick={()=>{setConfirmModalOpened(true)}}
                  >
                      {isMySellItem && !paybackedSellItem ? "판매 등록 취소하기" : isMySellItem && paybackedSellItem ? "판매 등록 취소하기(불가)" : !isMySellItem ? "구매하기" : ""}
                  </button>
                  <Modal
                      title = {null}
                      footer={null}
                      visible={confirmModalOpened}
                      closable={false}>
                      <div>
                          <Row>
                              <Col span={24}>
                                  <h5 style={{textAlign : "center", padding : "auto", fontSize : "17px", color : "#666666"}}>
                                      {isMySellItem ? "판매 등록을 취소하시겠습니까?" : "판매자에게 구매 신청을 보내겠습니까?"}
                                  </h5>
                              </Col>
                          </Row>
                          <Row style={{marginTop : "10px"}}>
                              <Col offset={2} span={8}><button
                                  style={{
                                      padding: "0",
                                      width: "100%",
                                      background: "rgba(51, 158, 172, 0.9)",
                                      color: "#ffffff",
                                      border: "none",
                                      borderRadius: "15px",
                                      fontSize: "16px",
                                      height: "30px"
                                  }}
                                  onClick={()=>{
                                      if(!isMySellItem || (isMySellItem && !paybackedSellItem)){
                                          setConfirmModalOpened(false);
                                          if(isMySellItem){
                                              cancelSellItem(item._id);
                                              setTimeout(() => {
                                                  goToHome();
                                              }, 2000);
                                          }
                                          else{
                                              confirm();
                                              setTimeout(() => {
                                                  goToSignIn();
                                              }, 2000);
                                          }
                                      }
                                     }}
                              >예</button></Col>
                              <Col offset={4} span={8}><button
                                  style={{
                                      padding: "0",
                                      width: "100%",
                                      background: "#fafafa",
                                      color: "#666666",
                                      border: "#666666 0.3px solid",
                                      borderRadius: "15px",
                                      fontSize: "16px",
                                      height: "30px"
                                  }}
                                  onClick={()=>{setConfirmModalOpened(false)}}
                              >아니요</button></Col>
                          </Row>
                      </div>
                  </Modal>
              </div>

            :
            <Link to="/signin">
              <button
                style={{
                  padding: "0",
                  width: "100%",
                  background: "rgba(51, 158, 172, 0.9)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "2.25vh",
                  fontSize: "2.5vh",
                  height: "5vh"
                }}>
                구매하기
              </button>
            </Link>
          }

        </Col>
      </Row>
    </div>
  );
}
export default Subject;
