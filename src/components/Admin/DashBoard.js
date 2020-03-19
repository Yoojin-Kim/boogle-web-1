import React, {useState, useEffect} from "react";
import moment from 'moment';
import {
    Row,
    Col,
    Modal,
    Table,
    Button,
    Input,
    Menu
} from "antd";
import axios from "axios";
import "./DashBoard.css";
import host from '../../server-settings/ServerApiHost';

const {SubMenu} = Menu;

export default function DashBoard() {
    const [headerIndex, setHeaderIndex] = useState(0);
    const [isAuth, setIsAuth] = useState(false);
    const [userList, setUserList] = useState([]);
    const [isAuthImageModalOpened, setIsAuthImageModalOpened] = useState(false);
    const [isStep2PaymentConfirmModalOpened, setIsStep2PaymentConfirmModalOpened] = useState(false);
    const [isStep2BoogleBoxConfirmModalOpened, setIsStep2BoogleBoxConfirmModalOpened] = useState(false);
    const [isStep1PaymentConfirmModalOpened, setIsStep1PaymentConfirmModalOpened] = useState(false);
    const [isStep4ConfirmModalOpened, setIsStep4ConfirmModalOpened] = useState(false);
    const [userCampusAuthImage, setUserCampusAuthImage] = useState(null);
    const [stepTWOList, setStepTWOList] = useState([]);
    const [stepFOURList, setStepFOURList] = useState([]);
    const [transData, setTransData] = useState([]);
    const [sellItemData, setSellItemData] = useState([]);
    const [buyerName, setBuyerName] = useState(null);
    const [sellerBankAccount, setSellerBankAccount] = useState(null);
    const [confirmButtonHidden, setConfirmButtonHidden] = useState(false);
    const [step2ConfirmType, setStep2ConfirmType] = useState(0);
    //   const [infoTable, setInfoTable] = useState()

    const getAllUsers = () => {
        axios.get(host + "/admin/users").then(response => {
            setUserList(response.data.data);
        });
    };

    const getStepTWO = () => {
        axios
            .get(host + "/admin/transactions/stepTwo")
            .then(res => {
                setStepTWOList(res.data.data);
            });
    };

    const getAllTrans = () => {
        axios.get(host + "/admin/transactions").then(res => {
            setTransData(res.data.data);
        });
    };

    const getAllSellItem = () => {
        axios.get(host + '/sell/all').then(res => {
            setSellItemData(res.data.data);
        });
    };

    const getStepFOUR = () => {
        axios
            .get(host + "/admin/transactions/stepFour")
            .then(res => {
                setStepFOURList(res.data.data);
            });
    };

    const getUserCampusAuthImage = userId => {
        axios
            .get(host + "/authImage?userId=" + userId)
            .then(response => {
                setUserCampusAuthImage(response.data.data);
            });
    };

    const confirmAuthUser = userId => {
        axios
            .get(host + "/authImage/confirm?userId=" + userId)
            .then(response => {
                window.location.reload();
            });
    };

    const changeStep = sellItemId => {
        axios
            .get(
                host + `/admin/change_step?sellItemId=${sellItemId}`
            )
            .then(res => {
                setConfirmButtonHidden(false);
                window.location.reload();
            });
    };

    const confirmPaymentDoneAndChangeStep = sellItemId => {
        axios
            .get(

                host + `/admin/payment/confirm?sellItemId=${sellItemId}`
            )
            .then(res => {
                setConfirmButtonHidden(false);
                window.location.reload();
            });
    };

    const confirmBoogleBoxInfoAndChangeStep = sellItemId => {
        axios
            .get(

                host + `/admin/booglebox/confirm?sellItemId=${sellItemId}`
            )
            .then(res => {
                setConfirmButtonHidden(false);
                window.location.reload();
            });
    };

    const confirmPaymentDoneAtStep1AndChangeStep = sellItemId => {
        axios
            .get(

                host + `/admin/payment/confirm/step1?sellItemId=${sellItemId}`
            )
            .then(res => {
                setConfirmButtonHidden(false);
                window.location.reload();
            });
    };

    const getBuyerName = buyerId => {
        axios
            .get(host + "/admin/buyerName?userId=" + buyerId)
            .then(response => {
                setBuyerName(response.data.data);
            });
    };

    const getSellerBankAccount = sellItemId => {
        axios
            .get(host + "/admin/sellerBankAccount?sellItemId=" + sellItemId)
            .then(response => {
                setSellerBankAccount(response.data.data);
            });
    };

    React.useEffect(() => {
        getAllUsers();
        getStepTWO();
        getStepFOUR();
        getAllSellItem();
        getAllTrans();
    }, [headerIndex]);

    React.useEffect(() => {
        getAllUsers();
        getStepTWO();
        getStepFOUR();
        getAllSellItem();
        getAllTrans();
    }, []);

    React.useEffect(() => {
        if (userCampusAuthImage != null) {
            setIsAuthImageModalOpened(true);
        }
    }, [userCampusAuthImage]);

    React.useEffect(() => {
        if (sellerBankAccount != null) {
            setIsStep4ConfirmModalOpened(true);
        }
    }, [sellerBankAccount]);

    React.useEffect(() => {
        if (buyerName !== null) {
            if(step2ConfirmType === 0) setIsStep2PaymentConfirmModalOpened(true);
            else if(step2ConfirmType === 1)setIsStep2BoogleBoxConfirmModalOpened(true);
            else setIsStep1PaymentConfirmModalOpened(true);
        }
    }, [buyerName]);

    const menu =
        <Menu
            style={{width: "100%", height: "100vh"}}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
        >
            <Menu.ItemGroup key="g1" title="회원 정보 관리">
                <Menu.Item key="1" onClick={() => setHeaderIndex(0)}>회원 전체 조회 및 학생증 인증</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup key="g2" title="거래 정보 관리">
                <Menu.Item key="2" onClick={() => setHeaderIndex(1)}>거래 전체 조회</Menu.Item>
                <Menu.Item key="3" onClick={() => setHeaderIndex(2)}>구매자 -> 북을 송금 / 판매자 북을 박스 정보 입력 확인</Menu.Item>
                <Menu.Item key="4" onClick={() => setHeaderIndex(3)}>북을 -> 판매자 송금 확인</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup key="g3" title="판매 상품 관리">
                <Menu.Item key="5" onClick={() => setHeaderIndex(4)}>판매 상품 전체 조회</Menu.Item>
            </Menu.ItemGroup>
        </Menu>

    const authImageConfirmModal = (authImageUrl, userId) => {
        return (
            <Modal
                title="Basic Modal"
                title="학생증 인증"
                visible={isAuthImageModalOpened}
                onCancel={() => {
                    setIsAuthImageModalOpened(false);
                }}
                footer={null}
                destroyOnClose={true}
            >
                <div>
                    <Row>
                        <Col span={16} offset={4}>
                            <img
                                style={{width: "100%", height: "auto"}}
                                src={authImageUrl}
                            ></img>
                        </Col>
                    </Row>
                    <Row style={{marginTop: "40px"}}>
                        <Col span={6} offset={10}>
                            <Button
                                onClick={() => {
                                    confirmAuthUser(userId);
                                }}
                            >
                                학생증 인증 확인
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Modal>
        );
    };

    const step2PaymentConfirmModal = (boxId, boxPassword, sellItemId) => {
        return (
            <Modal
                title="STEP 2 송금 확인"
                visible={isStep2PaymentConfirmModalOpened}
                onCancel={() => {
                    setBuyerName(null);
                    setIsStep2PaymentConfirmModalOpened(false);
                }}
                footer={null}
                destroyOnClose={true}
            >
                <div>
                    <Row>
                        <Col span={20} offset={2}>
                            <h5 style={{ fontSize : "15px", textAlign : "center"}}>구매자 이름 :
                                <h5 style={{ fontSize : "15px", fontWeight : "200", display : "inline"}}>{" "}{buyerName}</h5></h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20} offset={2}>
                            <h5 style={{ fontSize : "15px", textAlign : "center"}}>북을박스 번호 :
                                <h5 style={{ fontSize : "15px", fontWeight : "200", display : "inline"}}>{" "}{boxId}</h5></h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20} offset={2}>
                            <h5 style={{ fontSize : "15px", textAlign : "center"}}>북을박스 비밀번호 :
                                <h5 style={{ fontSize : "15px", fontWeight : "200", display : "inline"}}>{" "}{boxPassword}</h5></h5>
                        </Col>
                    </Row>
                    <Row style={{marginTop: "20px"}}>
                        <Col span={6} offset={10}>
                            {
                                confirmButtonHidden? <span>승인 진행중입니다.</span> :
                                    <Button onClick={()=>{
                                        setConfirmButtonHidden(true);
                                        confirmPaymentDoneAndChangeStep(sellItemId);
                                        getStepTWO();
                                        getStepFOUR();
                                        getAllTrans();
                                    }}>
                                        승인 완료
                                    </Button>
                            }
                        </Col>
                    </Row>
                </div>
            </Modal>
        );
    };

    const step2BoogleBoxConfirmModal = (boxId, boxPassword, sellItemId) => {
        return (
            <Modal
                title="STEP 2 북을박스 정보 확인"
                visible={isStep2BoogleBoxConfirmModalOpened}
                onCancel={() => {
                    setBuyerName(null);
                    setIsStep2BoogleBoxConfirmModalOpened(false);
                }}
                footer={null}
                destroyOnClose={true}
            >
                <div>
                    <Row>
                        <Col span={20} offset={2}>
                            <h5 style={{ fontSize : "15px", textAlign : "center"}}>구매자 이름 :
                                <h5 style={{ fontSize : "15px", fontWeight : "200", display : "inline"}}>{" "}{buyerName}</h5></h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20} offset={2}>
                            <h5 style={{ fontSize : "15px", textAlign : "center"}}>북을박스 번호 :
                                <h5 style={{ fontSize : "15px", fontWeight : "200", display : "inline"}}>{" "}{boxId}</h5></h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20} offset={2}>
                            <h5 style={{ fontSize : "15px", textAlign : "center"}}>북을박스 비밀번호 :
                                <h5 style={{ fontSize : "15px", fontWeight : "200", display : "inline"}}>{" "}{boxPassword}</h5></h5>
                        </Col>
                    </Row>
                    <Row style={{marginTop: "20px"}}>
                        <Col span={6} offset={10}>
                            {
                                confirmButtonHidden? <span>승인 진행중입니다.</span> :
                                    <Button onClick={()=>{
                                        setConfirmButtonHidden(true);
                                        confirmBoogleBoxInfoAndChangeStep(sellItemId);
                                        getStepTWO();
                                        getStepFOUR();
                                        getAllTrans();
                                    }}>
                                        승인 완료
                                    </Button>
                            }
                        </Col>
                    </Row>
                </div>
            </Modal>
        );
    };

    const step1PaymentConfirmModal = (sellItemId) => {
        return (
            <Modal
                title="STEP 1 송금 확인"
                visible={isStep1PaymentConfirmModalOpened}
                onCancel={() => {
                    setBuyerName(null);
                    setIsStep1PaymentConfirmModalOpened(false);
                }}
                footer={null}
                destroyOnClose={true}
            >
                <div>
                    <Row>
                        <Col span={20} offset={2}>
                            <h5 style={{ fontSize : "15px", textAlign : "center"}}>구매자 이름 :
                                <h5 style={{ fontSize : "15px", fontWeight : "200", display : "inline"}}>{" "}{buyerName}</h5></h5>
                        </Col>
                    </Row>
                    <Row style={{marginTop: "20px"}}>
                        <Col span={6} offset={10}>
                            {
                                confirmButtonHidden? <span>승인 진행중입니다.</span> :
                                    <Button onClick={()=>{
                                        setConfirmButtonHidden(true);
                                        confirmPaymentDoneAtStep1AndChangeStep(sellItemId);
                                        getStepTWO();
                                        getStepFOUR();
                                        getAllTrans();
                                    }}>
                                        승인 완료
                                    </Button>
                            }
                        </Col>
                    </Row>
                </div>
            </Modal>
        );
    };

    const step4ConfirmModal = (sellItemId) => {
        return (
            <Modal
                title="STEP 4 승인"
                visible={isStep4ConfirmModalOpened}
                onCancel={() => {
                    setBuyerName(null);
                    setIsStep4ConfirmModalOpened(false);
                }}
                footer={null}
                destroyOnClose={true}
            >
                <div>
                    <Row>
                        <Col span={20} offset={2}>
                            <h5 style={{ fontSize : "15px", textAlign : "center"}}>판매자 계좌 정보 :
                                <h5 style={{ fontSize : "15px", fontWeight : "200", display : "inline"}}>{" "}{sellerBankAccount}</h5></h5>
                        </Col>
                    </Row>
                    <Row style={{marginTop: "20px"}}>
                        <Col span={6} offset={9}>
                            {
                                confirmButtonHidden? <span>승인 진행중입니다.</span> :
                                    <Button onClick={()=>{
                                        setConfirmButtonHidden(true);
                                        changeStep(sellItemId);
                                        getStepTWO();
                                        getStepFOUR();
                                        getAllTrans();
                                    }}>
                                        승인 완료
                                    </Button>
                            }
                        </Col>
                    </Row>
                </div>
            </Modal>
        );
    };

    const columnsUser = [
        {
            title: "회원#",
            dataIndex: "id",
            key: "id",
            render: text => <a>{text}</a>
        },
        {
            title: "이름",
            dataIndex: "name",
            key: "name",
            render: text => <a>{text}</a>
        },
        {
            title: "이메일",
            dataIndex: "email",
            key: "email",
            render: text => <a>{text}</a>
        },
        {
            title: "연락처",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            render: text => <a>{text}</a>
        },
        {
            title: "닉네임",
            dataIndex: "nickname",
            key: "nickname",
            render: text => <a>{text}</a>
        },
        {
            title: "전공",
            dataIndex: "majorList",
            key: "majorList",
            render: text => <a>{text}</a>
        },
        {
            title: "학기",
            dataIndex: "semester",
            key: "semester",
            render: text => <a>{text}학기</a>
        },
        {
            title: "마케팅 정보 동의 여부",
            dataIndex: "checkList",
            key: "marketing",
            render: checkList => <a>{checkList[2] === "1" ? "O" : "X"}</a>
        },
        {
            title: "학생 인증 여부",
            dataIndex: "authComplete",
            key: "authComplete",
            render: (flag, record) =>
                flag ? (
                    <a>인증 완료</a>
                ) : (
                    <div>
                        <Button
                            onClick={() => getUserCampusAuthImage(record.id)}
                            style={{color: "black", fontWeight: 800}}
                        >
                            인증하기
                        </Button>

                        {userCampusAuthImage && userCampusAuthImage.authImageUrl
                            ? authImageConfirmModal(
                                userCampusAuthImage.authImageUrl,
                                userCampusAuthImage.userId
                            )
                            : null}
                    </div>
                )
        }
    ];
    const columnsSellItem = [
        {
            title: "판매상품#",
            dataIndex: "sellItem._id",
            key: "id",
            render: text => <a>{text}</a>
        },
        {
            title: "판매자#",
            dataIndex: "sellItem.sellerId",
            key: "sellerId",
            render: text => <a>{text}</a>
        },
        {
            title: "제목",
            dataIndex: "sellItem.title",
            key: "title",
            render: text => <div style={{ maxWidth : "150px" }}><a> {text}</a></div>
        },
        {
            title: "거래방식",
            dataIndex: "sellItem.dealType",
            key: "dealType",
            render: text => text === 0 ? <a>직거래</a> : <a>북을박스</a>
        },
        {
            title: "과목명",
            dataIndex: "sellItem.subject",
            key: "subject",
            render: text => <a>{text}</a>
        },
        {
            title: "교수명",
            dataIndex: "sellItem.professor",
            key: "professor",
            render: text => <a>{text}</a>
        },
        {
            title: "등록가격",
            dataIndex: "sellItem.originalPrice",
            key: "originalPrice",
            render: text => <a>{text}</a>
        },
        {
            title: "표시가격",
            dataIndex: "sellItem.regiPrice",
            key: "regiPrice",
            render: text => <a>{text}</a>
        },
        {
            title: "판매 등록 시각",
            dataIndex: "sellItem.regiTime",
            key: "regiTime",
            render: text =>
                <a>{moment(text.toString().substring(0, 10) + " " + text.toString().substring(11, 16)).add(9, 'hours').format('YYYY-MM-DD hh:mm:ss A')}</a>
        },
        {
            title: "거래성사",
            dataIndex: "sellItem.traded",
            key: "traded",
            render: text => text == true? <a>O</a> : <a>X</a>
        }
    ];

    const columnsTransaction = [
        {
            title: "판매자#",
            dataIndex: "sellerId",
            key: "sellerId",
            render: text => <a>{text}</a>
        },
        {
            title: "구매자#",
            dataIndex: "buyerId",
            key: "buyerId",
            render: text => <a>{text}</a>
        },
        {
            title: "거래 방식",
            dataIndex: "transactionType",
            key: "transactionType",
            render: type => (type === 0 ? <a>직거래</a> : <a>북을박스</a>)
        },
        {
            title: "마지막 STEP 변경 시각",
            dataIndex: "transactionTimeList",
            key: "transactionTimeList",
            render: text => {
                text = text[text.length - 1];
                return (
                    <a>{moment(text.toString().substring(0, 10) + " " + text.toString().substring(11, 16)).add(9, 'hours').format('YYYY-MM-DD hh:mm:ss A')}</a>)
            }
        },
        {
            title: "거래 성사 시각",
            dataIndex: "transCreatedTime",
            key: "transCreatedTime",
            render: text =>
                <a>{moment(text.toString().substring(0, 10) + " " + text.toString().substring(11, 16)).add(9, 'hours').format('YYYY-MM-DD hh:mm:ss A')}</a>
        },
        {
            title: "STEP",
            dataIndex: "step",
            key: "step",
            render: text => <a>{text}</a>
        },
        {
            title: "북을박스 번호",
            dataIndex: "boxId",
            key: "boxId",
            render: text => <a>{text}</a>
        },
        {
            title: "북을박스 비밀번호",
            dataIndex: "boxPassword",
            key: "boxPassword",
            render: text => <a>{text}</a>
        },
        {
            title: "운영팀 승인",
            dataIndex: "step",
            key: "boxPassword",
            render: (step, record) => {
                if(step == 1 && !record.paymentDone){
                    return(
                        <div>
                            <Button onClick={() => {
                                setStep2ConfirmType(2)
                                getBuyerName(record.buyerId);
                            }} style={{color: "black", fontWeight: 800}}>
                                송금 수동 승인
                            </Button>
                            {step1PaymentConfirmModal(record.sellItemId)}
                        </div>
                    )
                }
                else if (step === 2) {
                    return (
                        <div>
                            {!record.paymentDoneConfirmed && <div>
                                <Button onClick={() => {
                                    setStep2ConfirmType(0)
                                    getBuyerName(record.buyerId);
                                }} style={{color: "black", fontWeight: 800}}>
                                    송금 확인
                                </Button>
                                {step2PaymentConfirmModal(record.boxId, record.boxPassword, record.sellItemId)}
                            </div>}
                            {!record.boogleBoxInfoConfirmed && <div>
                                <Button onClick={() => {
                                    setStep2ConfirmType(1)
                                    getBuyerName(record.buyerId);
                                }} style={{color: "black", fontWeight: 800}}>
                                    북을박스 확인
                                </Button>
                                {step2BoogleBoxConfirmModal(record.boxId, record.boxPassword, record.sellItemId)}
                            </div>}
                        </div>
                    )
                }
                else if (step === 4) {
                    return(
                        <div>
                            <Button onClick={() => {
                                getSellerBankAccount(record.sellItemId);
                            }} style={{color: "black", fontWeight: 800}}>
                                승인하기
                            </Button>
                            {step4ConfirmModal(record.sellItemId)}
                        </div>
                    )
                }
                else {
                    return null;
                }
            }
        }
    ];

    return (
        <section id="dashboard-container">
            {!isAuth && !sessionStorage.getItem("isAdmin") ? (
                <Row style={{margin: "20% auto 20% auto"}}>
                    <Col span={6} offset={8}>
                        <Input
                            style={{width: "100%"}}
                            type="password"
                            placeholder="운영팀 비밀번호를 입력해주세요."
                            onPressEnter={e => {
                                if (e.target.value === "3428") {
                                    setIsAuth(true);
                                    sessionStorage.setItem("isAdmin", true);
                                }
                            }}
                        />
                    </Col>
                    <Col span={2} offset={0}>
                        <Button
                            onClick={e => {
                                if (e.target.value === "3428") {
                                    setIsAuth(true);
                                    sessionStorage.setItem("isAdmin", true);
                                }
                            }}
                        >
                            인증
                        </Button>
                    </Col>
                </Row>
            ) : null}
            {isAuth || sessionStorage.getItem("isAdmin") ? (
                <div>
                    <Row
                        style={{
                            width: "100%",
                            minHeight: "10%",
                            background: "black",
                            textAlign: "center",
                            display: "table"
                        }}
                    >
                        <Col style={{height: "100%"}} span={4} offset={10}>
                            <h5
                                style={{
                                    color: "white",
                                    verticalAlign: "middle",
                                    margin: "10% 0 10% 0"
                                }}
                            >
                                운영팀 대시보드
                            </h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4} offset={0}>{menu}</Col>
                        <Col span={20} offset={0}>

                            {headerIndex === 0 && userList.length !== 0 ? (
                                <Table columns={columnsUser} dataSource={userList}></Table>
                            ) : null}

                            {headerIndex === 1 ? (
                                <Table
                                    columns={columnsTransaction}
                                    dataSource={transData}
                                ></Table>
                            ) : null}

                            {headerIndex === 2 ? (
                                <Table
                                    columns={columnsTransaction}
                                    dataSource={stepTWOList}
                                ></Table>
                            ) : null}

                            {headerIndex === 3 ? (
                                <Table
                                    columns={columnsTransaction}
                                    dataSource={stepFOURList}
                                ></Table>
                            ) : null}

                            {headerIndex == 4? (
                                <Table
                                    columns={columnsSellItem}
                                    dataSource={sellItemData}
                                ></Table>
                            ) : null}

                        </Col>
                    </Row>
                </div>
            ) : null}
        </section>
    );
}
