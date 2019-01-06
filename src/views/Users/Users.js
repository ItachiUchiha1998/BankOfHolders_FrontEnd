import React, {Component} from 'react';
import {TabContent, TabPane, Nav, NavItem, NavLink, Col} from 'reactstrap';
import classnames from 'classnames';
import {Redirect} from 'react-router';
import SweetAlert from "react-bootstrap-sweetalert";
import AuthService from "../../AuthService";
import axios from 'axios';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import ThemeFloatingLabel from "../components/ThemeFloatingLabel";
import ThemeButton from "../components/ThemeButton";

const auth = new AuthService();
const coinLegend = {
    "Bitcoin": "BTC",
    "Ethereum": "ETH",
    "TrueUSD": "TUSD"
}

class OrderBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            redirectHome: false,
            nullvalue: false,
            loading: false,
            interest: 0,
            month: 1,
            coinAmount: 0,
            type: 'Borrow',
            complete: false,
            isBorrow: true,
            coinType_Collateral: 'Bitcoin',
            coinType_receiving: 'Ethereum',
            eth_mul: 1,
            btc_mul: 100000000,
            send: 'ok',
            error: "",
            usdtosat: 1,
            sattousd: 1,
            coinFetchComplete: false,
            coinTotal: 0,
            Bitcoin: false,
            Ethereum: false,
            TrueUSD: false,
        };
        this.CallApi = this.CallApi.bind(this);
        this.hideAlert = this.hideAlert.bind(this);
        this.hideSuccess = this.hideSuccess.bind(this);
        this.hideError = this.hideError.bind(this);
        this.ethmul = this.ethmul.bind(this);
        this.USDtoSatoshi = this.USDtoSatoshi.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
        this.getWalletData = this.getWalletData.bind(this);
    }

    USDtoSatoshi() {
        return axios.get('https://api.coinmarketcap.com/v2/ticker/?convert=BTC&limit=1')
            .then(res => {
                var price = JSON.stringify(res.data.data)
                            .split(":")[12]
                            .split(",")[0]
                var USDtoSat = parseInt(100000000 / price);
                //alert(USDtoSat);
                this.setState({usdtosat: USDtoSat, sattousd: parseInt(price * .00000001)})
            })
    }

    ethmul() {
        auth.fetch('eth/btc', {
            method: 'POST'
        }).then(res => {
            if (res.success === true) {
                this.setState({eth_mul: res.price})
            } else {
                this.setState({send: 'false', loading: false})
            }
        });
    }

    hideAlert() {
        this.setState({nullvalue: false})
    }

    hideError() {
        this.setState({send: 'true'})
    }

    hideSuccess() {
        this.setState({complete: false})
    }

    CallApi(e) {
        e.preventDefault();

        let interest = this.state.interest.toString();
        let month = this.state.month.toString();
        let col_coin = "";
        let coinAmount = this.state.coinAmount ;// * this.state.usdtosat;
        if (this.state.type === "Borrow") {
            col_coin = 1;
        }

        if (interest === "" || month === "" || this.state.type === '') {
            this.setState({nullvalue: true, error: '3'});
        }
        else if (this.state.type === 'Borrow') {

            if (this.state.coinType_Collateral === '') {
                this.setState({nullvalue: true, error: '2'});
            }
            else {
                col_coin = coinAmount * 3;

                this.setState({loading: true});
                console.log({
                    userid: this.state.user._id,
                    orderType: this.state.type,
                    amount: col_coin,
                    interestRate: interest,
                    months: month,
                    CollateralCoinType: this.state.coinType_Collateral,
                    ReceivingCoinType: this.state.coinType_receiving,
                    CollateralCoinAmount: col_coin / 100000000
                });
                auth.fetch('lendrequest/create', {
                    method: 'POST',
                    body: JSON.stringify({
                        userid: this.state.user._id,
                        orderType: this.state.type,
                        amount: coinAmount,
                        interestRate: interest,
                        months: month,
                        CollateralCoinType: this.state.coinType_Collateral,
                        ReceivingCoinType: this.state.coinType_receiving,
                        CollateralCoinAmount: col_coin / 100000000
                    })
                }).then(res => {
                    console.log(res);
                    if (res.success === true) {
                        this.setState({send: 'true', loading: false, complete: true})
                    } else {
                        if(this.state.coinType_Collateral==="Bitcoin")
                        this.setState({send: 'false', loading: false, error: res.error})
                        else 
                        this.setState({send: 'false', loading: false, error: JSON.stringify(res.error.name)})
                
                    }
                });
            }
        }
        else if (this.state.coinType_Collateral === 'Ethereum') {
            this.setState({loading: true});

            auth.fetch('lendrequest/create', {
                method: 'POST',
                body: JSON.stringify({
                    userid: this.state.user._id,
                    orderType: this.state.type,
                    amount: coinAmount,
                    interestRate: interest,
                    months: month,
                    //CollateralCoinType: this.state.coinType_Collateral,
                    //ReceivingCoinType: this.state.coinType_receiving,
                    //CollateralCoinAmount: (coinAmount*3) / 100000000,
                    coinType: this.state.coinType_Collateral,
                    coinAmount: coinAmount 
                })
            }).then(res => {
                console.log(res);
                if (res.success === true) {
                    this.setState({send: 'true', loading: false, complete: true})
                } else {
                    if(this.state.coinType_Collateral==="Bitcoin")
                        this.setState({send: 'false', loading: false, error: res.error})
                    else 
                        this.setState({send: 'false', loading: false, error: JSON.stringify(res.error.name)})
                }
            });
        }
        else if (this.state.coinType_Collateral === 'Bitcoin') {
            this.setState({loading: true});

            auth.fetch('lendrequest/create', {
                method: "POST",
                body: JSON.stringify({
                    userid: this.state.user._id,
                    orderType: this.state.type,
                    amount: coinAmount,
                    interestRate: interest,
                    months: month,
                    //CollateralCoinType: this.state.coinType_Collateral,
                    //ReceivingCoinType: this.state.coinType_receiving,
                    //CollateralCoinAmount: (coinAmount*3) / 100000000,
                    coinType: this.state.coinType_Collateral,
                    coinAmount: (coinAmount / 100000000),
                    //cc : this.state.sattousd
                })
            }).then(res => {
                console.log(res);
                if (res.success === true) {
                    this.setState({send: 'true', loading: false, complete: true});
                } else {
                if(this.state.coinType_Collateral==="Bitcoin")
                    this.setState({send: 'false', loading: false, error: res.error})
                else 
                    this.setState({send: 'false', loading: false, error: JSON.stringify(res.error.name)})
                }
            });
        }
        else {
            this.setState({loading: true});
            auth.fetch('lendrequest/create', {
                method: 'POST',
                body: JSON.stringify({
                    userid: this.state.user._id,
                    orderType: this.state.type,
                    amount: coinAmount, // satoshi
                    interestRate: interest,
                    months: month,
                    //CollateralCoinType: this.state.coinType_Collateral,
                    //ReceivingCoinType: this.state.coinType_receiving,
                    //CollateralCoinAmount: (coinAmount*3) / 100000000,
                    coinType: this.state.coinType_Collateral,
                    coinAmount: coinAmount / this.state.usdtosat
                })
            }).then(res => {
                console.log(res);
                if (res.success === true) {
                    this.setState({send: 'true', loading: false, complete: true})
                } else {
                    if(this.state.coinType_Collateral==="Bitcoin")
                        this.setState({send: 'false', loading: false, error: res.error})
                    else 
                        this.setState({send: 'false', loading: false, error: JSON.stringify(res.error.name)})
                }
            })
        }

    }

    getWalletData() {
        auth.fetch('btc/get', {
            method: 'POST',
            body: JSON.stringify({id: auth.getProfile().wallet.btc})
        }).then(res => {
            return axios.get('https://api.coinmarketcap.com/v2/ticker/?convert=BTC&limit=1')
                .then(res2 => {
                    var price = res2.data.data[1].quotes['USD'].price/res2.data.data[1].quotes['BTC'].price;
                    if (this.state.Ethereum && this.state.TrueUSD) {
                        this.setState({
                            Bitcoin: {
                                balance: parseFloat(res.balance),
                                address: res.address,
                                value: price
                            },
                            coinFetchComplete: true,
                            coinTotal: this.state.TrueUSD.balance + (this.state.Ethereum.balance * this.state.Ethereum.value) + (res.balance * price) + (this.state.user.total_reward_points*0.02)
                        });
                    } else {
                        this.setState({
                            Bitcoin: {
                                balance: parseFloat(res.balance),
                                address: res.address,
                                value: price
                            }
                        });
                    }
                })



        });
        auth.fetch('trueusd/get', {
            method: "POST",
            body: JSON.stringify({id: auth.getProfile().wallet.trueusd})
        }).then(res => {
            return axios.get('https://api.coinmarketcap.com/v2/ticker/?convert=TUSD&limit=1')
                .then(res2 => {
                    var price = res2.data.data[1].quotes['USD'].price/res2.data.data[1].quotes['TUSD'].price;

                    if (this.state.Ethereum && this.state.Bitcoin) {
                        this.setState({
                            TrueUSD: {
                                balance: parseFloat(res.balance),
                                address: res.address,
                                value: price
                            },
                            coinFetchComplete: true,
                            coinTotal: (this.state.Bitcoin.balance * this.state.Bitcoin.value) + (this.state.Ethereum.balance * this.state.Ethereum.value) + parseInt(res.balance)*price + (this.state.user.total_reward_points*0.02)
                        });
                    } else {
                        this.setState({
                            TrueUSD: {
                                balance: parseFloat(res.balance),
                                address: res.address,
                                value: price
                            }
                        });
                    }
                })


        });
        auth.fetch('eth/get', {
            method: "POST",
            body: JSON.stringify({
                id: auth.getProfile().wallet.eth
            })
        }).then(res => {
            return axios.get('https://api.coinmarketcap.com/v2/ticker/?convert=ETH&limit=1')
                .then(res2 => {
                    var price = res2.data.data[1].quotes['USD'].price/res2.data.data[1].quotes['ETH'].price;

                    if (this.state.Bitcoin && this.state.TrueUSD) {
                        this.setState({
                            Ethereum: {
                                balance: parseFloat(res.balance),
                                address: res.address,
                                value: price
                            },
                            coinFetchComplete: true,
                            coinTotal: (this.state.Bitcoin.balance * this.state.Bitcoin.value) + (this.state.TrueUSD.balance*this.state.TrueUSD.value) + (res.balance * price) + (this.state.user.total_reward_points*0.02)
                        })
                    } else {
                        this.setState({Ethereum: {
                                balance: parseFloat(res.balance),
                                address: res.address,
                                value: price
                            }})
                    }
                })
        });
    }

    toggleTab(tab) {
        if (this.state.type !== tab) {
            switch (tab) {
                case 'Borrow':
                    this.setState({
                        type: 'Borrow',
                        isBorrow: true,
                        coinAmount: 0,
                        interest: 0,
                        month: 1,
                        coinType_receiving: 'Ethereum',
                        coinType_Collateral: 'Bitcoin'
                    });
                    break;
                case 'Lend':
                    this.setState({
                        type: "Lend",
                        isBorrow: false,
                        coinAmount: 0,
                        interest: 0,
                        month: 1,
                        coinType_receiving: 'Ethereum',
                        coinType_Collateral: 'Bitcoin'
                    })
            }
        }
    }

    componentDidMount() {
        this.setState({user: auth.getProfile()});
        this.ethmul();
        this.getWalletData();
        this.USDtoSatoshi();
    }

    render() {
        if(!this.state.coinFetchComplete){
            return <span className="theme-text-h4">Loading ...</span>
        }
        return (
            <div className="animated fadeIn col-md-12">
                {
                    this.state.nullvalue ? <SweetAlert title="Error!" onConfirm={this.hideAlert}>All fields are
                            required {this.state.error}</SweetAlert>
                        : null
                }

                {
                    this.state.send == 'false' ?
                        <SweetAlert title="Error!" onConfirm={this.hideError}>{this.state.error}</SweetAlert>
                        : null
                }

                {
                    this.state.complete ?
                        <SweetAlert title="Success!" onConfirm={this.hideSuccess}>Order Placed! </SweetAlert>
                        : null
                }
                <div className="theme-text-h2 mt-theme-30">
                    Order book
                </div>

                <div className="white-card w-100 no-p mt-theme-30" style={{marginBottom: "30px"}}>
                    <Nav tabs className="order-tab-head w-100">
                        <NavItem className="order-book-tab w-25">
                            <NavLink
                                className={classnames({active: this.state.type == "Borrow"})}
                                onClick={() => {
                                    this.toggleTab('Borrow');
                                }}>
                                Borrow
                            </NavLink>
                        </NavItem>
                        <NavItem className="order-book-tab w-25">
                            <NavLink
                                className={classnames({active: this.state.type == 'Lend'})}
                                onClick={() => {
                                    this.toggleTab('Lend');
                                }}>
                                Lend
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent className="no-b" activeTab={this.state.type}>

                        {/*Borrow*/}

                        <TabPane tabId="Borrow" className="no-p">
                            <div className="no-p">
                                {/*left*/}
                                <Col md="6" className="p-4">
                                    <div className="theme-text-h4 text-bold">
                                        Choose Collateral Coin Type
                                    </div>
                                    <div className="no-p text-center">
                                        <button disabled={this.state.coinType_receiving == 'Bitcoin'} onClick={() => {
                                            this.setState({coinType_Collateral: "Bitcoin"})
                                        }}
                                                className={"coinTypeSelector pull-left " + (this.state.coinType_Collateral == 'Bitcoin' ? "active" : "")}>
                                            <img className="bitcoin"/>
                                            <span className="v-align-middle theme-text-h5">
                                                BTC <br/> <span
                                                className="theme-text-h6">Wallet:{this.state.Bitcoin.balance.toFixed(5)}</span>
                                            </span>
                                        </button>
                                        <button disabled={this.state.coinType_receiving == 'Ethereum'} onClick={() => {
                                            this.setState({coinType_Collateral: "Ethereum"})
                                        }}
                                                className={"coinTypeSelector " + (this.state.coinType_Collateral == 'Ethereum' ? "active" : "")}>
                                            <img className="ethereum"/>
                                            <span className="v-align-middle theme-text-h5">
                                                ETH <br/> <span
                                                className="theme-text-h6">Wallet:{this.state.Ethereum.balance.toFixed(5)}</span>
                                            </span>
                                        </button>
                                        <button disabled={this.state.coinType_receiving == 'TrueUSD'} onClick={() => {
                                            this.setState({coinType_Collateral: "TrueUSD"})
                                        }}
                                                className={"coinTypeSelector pull-right " + (this.state.coinType_Collateral == 'TrueUSD' ? "active" : "")}>
                                            <img className="tusd"/>
                                            <span className="v-align-middle theme-text-h5">
                                                USD <br/> <span
                                                className="theme-text-h6">Wallet:{this.state.TrueUSD.balance.toFixed(5)}</span>
                                            </span>
                                        </button>
                                    </div>
                                    <div className="theme-text-h4 text-bold mt-theme-30 d-inline-block">
                                        Choose Receiving Coin Type
                                    </div>
                                    <div className="no-p text-center">
                                        <button disabled={this.state.coinType_Collateral == 'Bitcoin'} onClick={() => {
                                            this.setState({coinType_receiving: "Bitcoin"})
                                        }}
                                                className={"coinTypeSelector pull-left " + (this.state.coinType_receiving == 'Bitcoin' ? "active" : "")}>
                                            <img className="bitcoin"/>
                                            <span className="v-align-middle theme-text-h5">
                                                BTC <br/> <span
                                                className="theme-text-h6">Wallet:{this.state.Bitcoin.balance.toFixed(5)}</span>
                                            </span>
                                        </button>
                                        <button disabled={this.state.coinType_Collateral == 'Ethereum'} onClick={() => {
                                            this.setState({coinType_receiving: "Ethereum"})
                                        }}
                                                className={"coinTypeSelector " + (this.state.coinType_receiving == 'Ethereum' ? "active" : "")}>
                                            <img className="ethereum"/>
                                            <span className="v-align-middle theme-text-h5">
                                                ETH <br/> <span
                                                className="theme-text-h6">Wallet:{this.state.Ethereum.balance.toFixed(5)}</span>
                                            </span>
                                        </button>
                                        <button disabled={this.state.coinType_Collateral == 'TrueUSD'} onClick={() => {
                                            this.setState({coinType_receiving: "TrueUSD"})
                                        }}
                                                className={"coinTypeSelector pull-right " + (this.state.coinType_receiving == 'TrueUSD' ? "active" : "")}>
                                            <img className="tusd" alt=""/>
                                            <span className="v-align-middle theme-text-h5">
                                                USD <br/> <span
                                                className="theme-text-h6">Wallet:{this.state.TrueUSD.balance.toFixed(5)}</span>
                                            </span>
                                        </button>
                                    </div>
                                    <div className="mt-theme-30">
                                        <span className="theme-text-h4 text-bold">
                                            Interest Rate ({this.state.interest} %)
                                        </span>
                                        <Slider
                                            min={0}
                                            max={30}
                                            value={this.state.interest}
                                            labels={{0: "0%", 100: "30%"}}
                                            onChange={(value) => {
                                                this.setState({interest: value})
                                            }}
                                        />
                                    </div>

                                    <div className="mt-theme-30">
                                        <span className="theme-text-h4 text-bold">
                                            Number of months ({this.state.month})
                                        </span>
                                        <Slider
                                            min={1}
                                            max={36}
                                            value={this.state.month}
                                            labels={{0: "1", 100: "36"}}
                                            onChange={(value) => {
                                                this.setState({month: value})
                                            }}
                                        />
                                    </div>
                                    <div className="theme-text-h4 mt-theme-30 pt-3">
                                        Loan-to-value is 33%
                                    </div>

                                </Col>
                                {/*right*/}
                                <Col md="6" className="background-theme p-3" style={{height: "auto"}}>
                                    <Col md="8">
                                        <ThemeFloatingLabel type="number" placeholder="Amount to borrow (USD)"
                                                            icon="money" onChange={(e) => {
                                            this.setState({coinAmount: Math.trunc(parseFloat(e.target.value || 0) * this.state.usdtosat)})
                                        }}/>
                                    </Col>
                                    {/*<Col md="4" className="theme-text-h4 pt-3">
                                        $ {(this.state[this.state.coinType_receiving].balance*this.state[this.state.coinType_receiving].value).toFixed(3)}
                                    </Col>*/}
                                    <Col md="12">
                                        <div className="important-box">
                                            <span className="theme-text-h6">*Important</span>
                                            <div className="theme-text-h5">
                                                Wallet balance after <span
                                                className="text-bold">order</span> confirmation
                                            </div>
                                            <div className="theme-text-h4">
                                                <span
                                                    className="text-bold">{((this.state.coinAmount * this.state.sattousd) / (parseFloat(this.state[this.state.coinType_receiving].value)) + this.state[this.state.coinType_receiving].balance).toFixed(5)}</span> {coinLegend[this.state.coinType_receiving]}
                                                &nbsp;| <span
                                                className="text-bold">{(parseFloat(this.state[this.state.coinType_Collateral].balance) - ((this.state.coinAmount * 3 * this.state.sattousd) / (parseFloat(this.state[this.state.coinType_Collateral].value)))).toFixed(5)}</span> {coinLegend[this.state.coinType_Collateral]}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="12">
                                        <div className="theme-text-h4 pt-3">
                                            Requested amount to borrow (*{coinLegend[this.state.coinType_receiving]})
                                        </div>
                                        <div className="theme-text-h1" style={{color: "#7b7b7b", lineHeight: "1"}}>
                                            {((this.state.coinAmount * this.state.sattousd) / this.state[this.state.coinType_receiving].value).toFixed(5)}
                                            <span
                                                className="theme-text-h4">{coinLegend[this.state.coinType_receiving]}</span>
                                        </div>
                                    </Col>
                                    <Col md="6" className="pr-0 mt-theme-30">
                                        <div className="color-primary theme-text-h5">Interest</div>
                                        <div className="d-inline-block" style={{color: "#7b7b7b", lineHeight: "1"}}>
                                            <span
                                                className="theme-text-h2">{(((((this.state.coinAmount * this.state.sattousd) / this.state[this.state.coinType_receiving].value)*(this.state.interest/100))/12)*this.state.month).toFixed(5)}</span>
                                            &nbsp;<span
                                            className="theme-text-h6">{coinLegend[this.state.coinType_receiving]}</span>
                                            <span
                                                className="color-primary theme-text-h6">/{this.state.month}months</span>
                                        </div>
                                    </Col>
                                    <Col md="6" className="mt-theme-30">
                                        <div className="color-primary theme-text-h5">Interest Rate ({this.state.interest}%)
                                        </div>
                                        <div className="d-inline-block" style={{color: "#7b7b7b", lineHeight: "1"}}>
                                            <span className="theme-text-h2">{(((this.state.coinAmount * this.state.sattousd) / this.state[this.state.coinType_receiving].value)*(this.state.interest/100)).toFixed(5)}</span>
                                            &nbsp;<span
                                            className="theme-text-h6">{coinLegend[this.state.coinType_receiving]}</span>
                                            <span
                                                className="color-primary theme-text-h6">/p.a</span>
                                        </div>
                                    </Col>
                                    <div className="h-line w-100"></div>
                                    <Col md="12" className="d-inline-block">
                                        <div className="d-inline-block">
                                            <div className="color-primary theme-text-h5">Total
                                            </div>
                                            <div className="d-inline-block" style={{lineHeight: "1"}}>
                                                <span className="theme-text-h1">{(((this.state.coinAmount * this.state.sattousd) / this.state[this.state.coinType_receiving].value)+((((this.state.coinAmount * this.state.sattousd) / this.state[this.state.coinType_receiving].value)*(this.state.interest/100))/12)*this.state.month).toFixed(5)}</span>
                                                <span className="theme-text-h5"> {coinLegend[this.state.coinType_receiving]}</span>
                                                <br/>
                                                <span className="theme-text-h2" style={{color: "#7b7b7b"}}>{((((this.state.coinAmount * this.state.sattousd) / this.state[this.state.coinType_receiving].value)+((((this.state.coinAmount * this.state.sattousd) / this.state[this.state.coinType_receiving].value)*(this.state.interest/100))/12)*this.state.month)/this.state.month).toFixed(5)}</span>
                                                <span className="theme-text-h6" style={{color: "#7b7b7b"}}>{coinLegend[this.state.coinType_receiving]}</span>
                                                <span className="color-primary theme-text-h6" >/Monthly EMI</span>
                                            </div>
                                        </div>
                                        <div className="mt-theme-30 no-p pull-right d-inline-block" >
                                            {
                                                !(this.state.interest > 0 && this.state.month > 0 && this.state.coinAmount > 0 && this.state.coinType_Collateral && this.state.coinType_receiving && (this.state.coinType_Collateral != this.state.coinType_receiving)) &&
                                                <ThemeButton disabled={true} onClick={this.CallApi}
                                                             buttonText="Order" buttonSize="large"/>
                                            }
                                            {
                                                (this.state.interest > 0 && this.state.month > 0 && this.state.coinAmount > 0 && !this.state.loading && this.state.coinType_Collateral && this.state.coinType_receiving && (this.state.coinType_Collateral != this.state.coinType_receiving)) &&
                                                <ThemeButton onClick={this.CallApi} buttonText="Order" buttonSize="large"/>
                                            }
                                            {
                                                this.state.loading &&
                                                <ThemeButton disabled={true} buttonText="Ordering ..." buttonSize="large"/>
                                            }
                                        </div>
                                    </Col>
                                </Col>
                            </div>
                        </TabPane>

                        {/*Lend*/}

                        <TabPane tabId="Lend" className="no-p">
                            <div className="no-p">
                                <Col md="6" className="p-4">
                                    <div className="theme-text-h4 text-bold mt-theme-30">
                                        Choose Coin Type
                                    </div>
                                    <div className="no-p text-center">
                                        <button onClick={() => {
                                            this.setState({coinType_Collateral: "Bitcoin"})
                                        }}
                                                className={"coinTypeSelector pull-left " + (this.state.coinType_Collateral == 'Bitcoin' ? "active" : "")}>
                                            <img className="bitcoin"/>
                                            <span className="v-align-middle theme-text-h5">
                                                BTC <br/> <span
                                                className="theme-text-h6">Wallet:{this.state.Bitcoin.balance.toFixed(5)}</span>
                                            </span>
                                        </button>
                                        <button onClick={() => {
                                            this.setState({coinType_Collateral: "Ethereum"})
                                        }}
                                                className={"coinTypeSelector " + (this.state.coinType_Collateral == 'Ethereum' ? "active" : "")}>
                                            <img className="ethereum"/>
                                            <span className="v-align-middle theme-text-h5">
                                                ETH <br/> <span
                                                className="theme-text-h6">Wallet:{this.state.Ethereum.balance.toFixed(5)}</span>
                                            </span>
                                        </button>
                                        <button onClick={() => {
                                            this.setState({coinType_Collateral: "TrueUSD"})
                                        }}
                                                className={"coinTypeSelector pull-right " + (this.state.coinType_Collateral == 'TrueUSD' ? "active" : "")}>
                                            <img className="tusd"/>
                                            <span className="v-align-middle theme-text-h5">
                                                USD <br/> <span
                                                className="theme-text-h6">Wallet:{this.state.TrueUSD.balance.toFixed(5)}</span>
                                            </span>
                                        </button>
                                    </div>
                                    <div className="mt-theme-30">
                                        <span className="theme-text-h4 text-bold">
                                            Interest Rate ({this.state.interest} %)
                                        </span>
                                        <Slider
                                            min={0}
                                            max={30}
                                            value={this.state.interest}
                                            labels={{0: "0%", 100: "30%"}}
                                            onChange={(value) => {
                                                this.setState({interest: value})
                                            }}
                                        />
                                    </div>

                                    <div className="mt-theme-60">
                                        <span className="theme-text-h4 text-bold">
                                            Number of months ({this.state.month})
                                        </span>
                                        <Slider
                                            min={1}
                                            max={36}
                                            value={this.state.month}
                                            labels={{0: "1", 100: "36"}}
                                            onChange={(value) => {
                                                this.setState({month: value})
                                            }}
                                        />
                                    </div>
                                    <div className="theme-text-h4 mt-theme-30 pt-3">
                                        Your loan is backed by assets worth 3X loan amount
                                    </div>
                                </Col>
                                <Col md="6" className="background-theme p-3">
                                    <Col md="8">
                                        <ThemeFloatingLabel type="tel" placeholder="Amount to lend (USD)"
                                                            icon="money" onChange={(e) => {
                                            this.setState({coinAmount: Math.trunc(parseFloat(e.target.value || 0) * this.state.usdtosat)})
                                        }}/>
                                    </Col>
                                    {/*<Col md="4" className="theme-text-h4 pt-3">
                                        $ {(this.state[this.state.coinType_receiving].balance*this.state[this.state.coinType_receiving].value).toFixed(3)}
                                    </Col>*/}
                                    <Col md="12">
                                        <div className="important-box">
                                            <span className="theme-text-h6">*Important</span>
                                            <div className="theme-text-h5">
                                                Wallet balance after <span
                                                className="text-bold">order</span> confirmation
                                            </div>
                                            <div className="theme-text-h4">
                                                <span className="text-bold">{(this.state[this.state.coinType_Collateral].balance - (this.state.coinAmount * this.state.sattousd / (this.state[this.state.coinType_Collateral].value))).toFixed(5)}</span>{coinLegend[this.state.coinType_Collateral]}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="12">
                                        <div className="theme-text-h4 pt-3">
                                            Requested amount to Lend (*{coinLegend[this.state.coinType_Collateral]})
                                        </div>
                                        <div className="theme-text-h1" style={{color: "#7b7b7b", lineHeight: "1"}}>
                                            {((this.state.coinAmount * this.state.sattousd) / (this.state[this.state.coinType_Collateral].value)).toFixed(5)}
                                            <span className="theme-text-h4">{coinLegend[this.state.coinType_Collateral]}</span>
                                        </div>
                                    </Col>


                                    <Col md="6" className="pr-0 mt-theme-30">
                                        <div className="color-primary theme-text-h5">Interest</div>
                                        <div className="d-inline-block" style={{color: "#7b7b7b", lineHeight: "1"}}>
                                            <span
                                                className="theme-text-h2">{(((((this.state.coinAmount * this.state.sattousd) / this.state[this.state.coinType_Collateral].value)*(this.state.interest/100))/12)*this.state.month).toFixed(5)}</span>
                                            &nbsp;<span
                                            className="theme-text-h6">{coinLegend[this.state.coinType_Collateral]}</span>
                                            <span
                                                className="color-primary theme-text-h6">/{this.state.month}months</span>
                                        </div>
                                    </Col>
                                    <Col md="6" className="mt-theme-30">
                                        <div className="color-primary theme-text-h5">Interest Rate ({this.state.interest}%)
                                        </div>
                                        <div className="d-inline-block" style={{color: "#7b7b7b", lineHeight: "1"}}>
                                            <span className="theme-text-h2">{(((this.state.coinAmount * this.state.sattousd) / this.state[this.state.coinType_Collateral].value)*(this.state.interest/100)).toFixed(5)}</span>
                                            &nbsp;<span
                                            className="theme-text-h6">{coinLegend[this.state.coinType_Collateral]}</span>
                                            <span
                                                className="color-primary theme-text-h6">/p.a</span>
                                        </div>
                                    </Col>
                                    <div className="h-line w-100"></div>
                                    <Col md="12">

                                        <div className="mt-theme-30 d-inline-block">
                                            <div className="color-primary theme-text-h5">Total
                                            </div>
                                            <div className="d-inline-block" style={{lineHeight: "1"}}>
                                                <span className="theme-text-h1">{(((this.state.coinAmount * this.state.sattousd) / this.state[this.state.coinType_Collateral].value)+((((this.state.coinAmount * this.state.sattousd) / this.state[this.state.coinType_Collateral].value)*(this.state.interest/100))/12)*this.state.month).toFixed(5)}</span>
                                                <span className="theme-text-h5"> {coinLegend[this.state.coinType_Collateral]}</span>
                                                <br/>
                                                <span className="theme-text-h2" style={{color: "#7b7b7b"}}>{((((this.state.coinAmount * this.state.sattousd) / this.state[this.state.coinType_Collateral].value)+((((this.state.coinAmount * this.state.sattousd) / this.state[this.state.coinType_Collateral].value)*(this.state.interest/100))/12)*this.state.month)/this.state.month).toFixed(5)}</span>
                                                <span className="theme-text-h6" style={{color: "#7b7b7b"}}>{coinLegend[this.state.coinType_Collateral]}</span>
                                                <span className="color-primary theme-text-h6" >/Borrower pay back p.m</span>
                                            </div>
                                        </div>
                                        <div className="mt-theme-60 no-p pull-right d-inline-block">
                                            {
                                                !(this.state.interest > 0 && this.state.month > 0 && this.state.coinAmount > 0 && this.state.coinType_Collateral) &&
                                                <ThemeButton disabled={true} onClick={this.CallApi}
                                                             buttonText="Order" buttonSize="large"/>
                                            }
                                            {
                                                (this.state.interest > 0 && this.state.month > 0 && this.state.coinAmount > 0 && !this.state.loading && this.state.coinType_Collateral) &&
                                                <ThemeButton onClick={this.CallApi} buttonText="Order" buttonSize="large"/>
                                            }
                                            {
                                                this.state.loading &&
                                                <ThemeButton disabled={true} buttonText="Ordering ..." buttonSize="large"/>
                                            }
                                        </div>
                                    </Col>
                                </Col>
                            </div>
                        </TabPane>
                    </TabContent>
                </div>
            </div>

        );
    }
}

export default OrderBook;
