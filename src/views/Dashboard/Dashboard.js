import React, {Component} from 'react'
import {Redirect} from 'react-router'
import {Col, Progress, Container} from 'reactstrap';
import ThemeButton from '../components/ThemeButton';
import DashboardBanner from '../components/DashboardBanner';
import AuthService from '../../AuthService';
import axios from "axios/index";

const auth = new AuthService();
const bannerTextMain = "Make a transaction and earn 100 BoH tokens now !";
const bannerTextSmall = "You can pay with BoH tokens for our services";
const coinLogo = "/assets/bohlogo_small.png";
const totalTokens = 2000;
const tokenPossibleHC = 1770;
const tokenRateHC = 0.02;


class DashboardBalanceWidget extends Component {
    constructor(props) {
        super(props);

        this.earnTokens = this.earnTokens.bind(this);

        this.state = {
            user: auth.getProfile()
        }
    }

    earnTokens() {
        console.log('Earn Token');
    }

    render() {
        return (
            <div className="white-card p-3 balance-widget">
                <Col md="8" className="no-p">
                    <div className="text-label theme-text-h4">
                        <i className="material-icons v-align-middle">info</i>
                        <span className="v-align-middle"> Total BoH tokens earned</span>
                    </div>
                    <div className="theme-text-h1 col-md-12">
                        {new Intl.NumberFormat().format(this.state.user.total_reward_points)}
                    </div>
                    <div className="theme-text-h4 mt-3 col-md-12">
                        Out of your possible <img src={coinLogo} className="coin-img" alt="coin"></img> {new Intl.NumberFormat().format(tokenPossibleHC)}
                    </div>
                </Col>
                <div className="va-top mt-3 no-p d-inline-block w-25 pull-right">
                    <div className="legend d-inline-block">
                        <div className="theme-text-h5">
                            <span className="dot blue mr-2 d-inline-block"></span> Earned
                        </div>
                        <div className="theme-text-h5" style={{marginTop: "5px"}}>
                            <span className="dot lightblue mr-2 d-inline-block"></span> Predictive
                        </div>
                        <div className="theme-text-h5" style={{marginTop: "5px"}}>
                            <span className="dot mr-2"></span> Future
                        </div>
                    </div>
                </div>
                <Col md="12">
                    <div className="pt-3">
                        <Progress className="predictive" value={Math.round((tokenPossibleHC / totalTokens) * 100)}/>
                        <Progress value={Math.round((this.state.user.total_reward_points / totalTokens) * 100)}/>
                    </div>
                </Col>
                <Col md="12">
                    <div className="theme-text-h4 pt-4 display-inb">
                        One token value is $ {tokenRateHC}
                    </div>
                    {/*<span className="text-label pull-right pt-3">
                        <ThemeButton onClick={this.earnTokens} buttonText="Earn Tokens" buttonSize='small'/>
                    </span>*/}
                </Col>
            </div>
        );
    }
}

class DashboardTableStack extends Component {
    constructor(props) {
        super(props);

        this.getLeaderboard = this.getLeaderboard.bind(this);
        this.imageUrl = this.imageUrl.bind(this);

        this.state = {
            leaderBoardFetched: false,
            leaderBoard: []
        };
    }

    getLeaderboard() {
        auth.fetch('leaderboard/get', {
            method: 'POST'
        }).then(res => {
            if (res.success) {
                var data = []
                for (var each in res.data){
                    if(parseInt(each) <= 9){
                        data.push(res.data[each]);
                    }
                }
                this.setState({leaderBoardFetched: true, leaderBoard: data})
            }
        })
    }

    imageUrl(index) {
        return "/assets/numbers/" + index + ".png";
    }

    render() {
        if (!this.state.leaderBoardFetched) {
            this.getLeaderboard();
            return null;
        }
        return (
            <div className="white-card tableStack no-pm">
                <Col xs="12" className="p-3">
                    <div className="theme-text-h4">
                        <i className="material-icons v-align-middle">info</i>
                        <span className="v-align-middle"> Leaderboard</span>
                    </div>
                    <div className="theme-text-h2 pl-4">
                        See how you stack up
                    </div>
                    <table className="leaderboard">
                        <thead>
                        <tr>
                            <th className="rankHead theme-text-h4">
                                Rank
                            </th>
                            <th className="nameHead theme-text-h4">
                                Name
                            </th>
                            <th className="tokenHead theme-text-h4">
                                Tokens
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.leaderBoard.map(object => {
                                return (
                                    <tr style={{borderBottom: "1px solid #e5e5e5"}} key={this.state.leaderBoard.indexOf(object) + 1}>
                                        <td className="rankHead">
                                            <span className={"rankCircle " + (this.state.leaderBoard.indexOf(object) + 1 < 4?"top":"")}>{this.state.leaderBoard.indexOf(object) + 1}</span>
                                        </td>
                                        <td className={"nameHead "+ (this.state.leaderBoard.indexOf(object)+1 < 4?"color-primary":"")}>
                                            {object.username}
                                        </td>
                                        <td className={"tokenHead "+ (this.state.leaderBoard.indexOf(object)+1 < 4?"color-primary":"")}>
                                            {object.total_reward_points}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>

                    </table>
                </Col>
            </div>
        );
    }
}

class KickOffCard extends Component {
    constructor(props) {
        super(props);

        this.copyText = this.copyText.bind(this);

        this.state = {
            user: null,
            referralLink: '',
            copied: false
        };
    }

    copyText() {
        var copyText = document.getElementById('referralInput');
        copyText.select();
        var address= this.state.referralLink;
        this.setState({copied: document.execCommand("copy"), referralLink: "Your referral link copied"});
        setTimeout(() => {
            this.setState({copied: false, referralLink: address});
        }, 5000);
    }


    componentDidMount(){
        this.setState({user: auth.getProfile(), referralLink: 'http://34.216.244.101/register/'+ auth.getProfile().social_id})
    }

    render() {
        return (
            <div className="white-card p-3 balance-widget">
                <Col md="12" className="no-p">
                    <div className="text-label theme-text-h4">
                        <i className="material-icons v-align-middle">info</i>
                        <span className="v-align-middle"> Share with your friends to get 100 more tokens</span>
                    </div>
                    <div className="theme-text-h2 col-md-12 mt-1">
                        Earn 100 BoH tokens!
                    </div>
                </Col>
                <Col md="12" className="mt-theme-30">
                    <input readOnly id="referralInput" className="referral-input" style={{color: this.state.copied?"blue":"black"}} value={this.state.referralLink} type="text"/>
                    <ThemeButton buttonText="Copy" onClick={this.copyText} className="copy-button"/>
                </Col>
                <Col md="12" className="mt-theme-30 social-btns">
                    <a className="d-inline-block m-lr-5" href={"whatsapp://send?text="+(this.state.referralLink)}>
                        <span className="fa fa-whatsapp fa-2x"></span>
                    </a>
                    <a className="d-inline-block m-lr-5" href={"https://facebook.com/sharer/sharer.php?u="+this.state.referralLink}>
                        <span className="fa fa-facebook fa-2x"></span>
                    </a>
                    <a className="d-inline-block m-lr-5" href={"https://twitter.com/intent/tweet/?text=&url="+this.state.referralLink}>
                        <span className="fa fa-twitter fa-2x"></span>
                    </a>
                    <a className="d-inline-block m-lr-5" href={"https://www.linkedin.com/shareArticle?mini=true&url="+this.state.referralLink}>
                        <span className="fa fa-linkedin fa-2x"></span>
                    </a>
                    <a className="d-inline-block  m-lr-5" href={"https://plus.google.com/share?url="+this.state.referralLink}>
                        <span className="fa fa-google-plus fa-2x"></span>
                    </a>
                    {/*<a className="d-inline-block m-lr-5" href="">
                        <span className="fa fa-instagram fa-2x"></span>
                    </a>*/}
                    <a className="d-inline-blockm-lr-5m-lr-5" href={"https://telegram.me/share/url?text=&url="+this.state.referralLink}>
                        <span className="fa fa-telegram fa-2x"></span>
                    </a>
                </Col>
            </div>
        )
    }
}

class DashWidgetCardLink extends Component {
    constructor(props) {
        super(props);

        this.imageUrl = this.props.imageUrl;
        this.linkAddress = this.props.linkAddress;

        this.state = {
            imageUrl: this.imageUrl
        }
    }

    render() {
        return (
            <div className="white-card link-card">
                <a href={this.linkAddress} style={{backgroundImage: "url('"+this.state.imageUrl.replace('_n', '_h')+"')"}}>
                    <img src={this.state.imageUrl}/>
                </a>
            </div>
        )
    }
}

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.addFund = this.addFund.bind(this);
        this.borLend = this.borLend.bind(this);
        this.getWalletData = this.getWalletData.bind(this);

        this.state = {
            redirect: false,
            redirectUrl: '',
            user: auth.getProfile(),
            btc: null,
            eth: null,
            usd: null,
            coinFetchComplete: false,
            coinTotal: 0
        };
    }

    getWalletData() {
        auth.fetch('btc/get', {
            method: 'POST',
            body: JSON.stringify({id: auth.getProfile().wallet.btc})
        }).then(res => {
            return axios.get('https://api.coinmarketcap.com/v2/ticker/?convert=BTC&limit=1')
                .then(res2 => {
                    var price = res2.data.data[1].quotes['USD'].price/res2.data.data[1].quotes['BTC'].price;
                    if (this.state.eth && this.state.usd) {
                        this.setState({
                            btc: {
                                balance: parseFloat(res.balance),
                                address: res.address,
                                value: price
                            },
                            coinFetchComplete: true,
                            coinTotal: this.state.usd.balance + (this.state.eth.balance * this.state.eth.value) + (res.balance * price) + (this.state.user.total_reward_points*0.02)
                        });
                    } else {
                        this.setState({
                            btc: {
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

                    if (this.state.eth && this.state.btc) {
                        this.setState({
                            usd: {
                                balance: parseFloat(res.balance),
                                address: res.address,
                                value: price
                            },
                            coinFetchComplete: true,
                            coinTotal: (this.state.btc.balance * this.state.btc.value) + (this.state.eth.balance * this.state.eth.value) + parseInt(res.balance)*price + (this.state.user.total_reward_points*0.02)
                        });
                    } else {
                        this.setState({
                            usd: {
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

                    if (this.state.btc && this.state.usd) {
                        this.setState({
                            eth: {
                                balance: parseFloat(res.balance),
                                address: res.address,
                                value: price
                            },
                            coinFetchComplete: true,
                            coinTotal: (this.state.btc.balance * this.state.btc.value) + (this.state.usd.balance*this.state.usd.value) + (res.balance * price) + (this.state.user.total_reward_points*0.02)
                        })
                    } else {
                        this.setState({eth: {
                                balance: parseFloat(res.balance),
                                address: res.address,
                                value: price
                            }})
                    }
                })
        });
    }

    addFund() {
        this.setState({redirect: true, redirectUrl: '/wallet'})
    }

    borLend() {
        this.setState({redirect: true, redirectUrl: '/borrow-len'})
    }

    componentDidMount() {
        this.getWalletData();
    }

    render() {
        if (this.state.redirect || !auth.loggedIn()) {
            return <Redirect to={{pathname: this.state.redirectUrl}}/>
        }

        return (
            <div className="animated fadeIn height-100">
                <Col md="12" className="no-p">
                    <DashboardBanner textMain={bannerTextMain} textSmall={bannerTextSmall} button1Action={this.addFund}
                                     button2Action={this.borLend}/>
                </Col>
                <Col md="12" className="no-p">
                    <div className="p-3">
                        {
                            this.state.coinFetchComplete &&
                            <div className="white-card no-p">
                                <Col md="3" xs="12" className="b-r-1 p-4">
                                    <span className="theme-text-h4">Wallet Balance</span>
                                    <div className="theme-text-h1" style={{lineHeight: "1.7"}}>
                                        <span className="color-green">$</span> {this.state.coinTotal.toFixed(2) || 0.00}
                                    </div>
                                </Col>
                                <Col md="9" xs="12" className="p-4">
                                    <div className="theme-text-h4 mb-3">Wallet Balance by crypto</div>
                                    <Col md="3" xs="6" className="no-p height-100 mb-2">
                                        <Col md="2" xs="2" className="no-p height-100">
                                            <img style={{width: '100%'}} src="/assets/bohlogo_small.png"/>
                                        </Col>
                                        <Col md="4" xs="5" className="height-100 no-p">
                                            <div className="height-100 flex-container pl-2">
                                                <span className="theme-text-h4">BOH</span>
                                                <span className="text-ellipsis" style={{color: "#888"}}>$ {(this.state.user.total_reward_points * 0.02).toFixed(2)}</span>
                                            </div>
                                        </Col>
                                        <Col md="6" xs="5" className="no-p">
                                            <div className="height-100 flex-container pl-2">
                                                <span
                                                    className="theme-text-h4 color-green">$ 0.02</span>
                                                <span>{this.state.user.total_reward_points}</span>
                                            </div>
                                        </Col>
                                    </Col>
                                    <Col md="3" xs="6" className="no-p height-100 mb-2">
                                        <Col md="2" xs="2" className="no-p height-100">
                                            <img style={{width: '100%'}} src="/assets/btcicon.png"/>
                                        </Col>
                                        <Col md="4" xs="5" className="height-100 no-p">
                                            <div className="height-100 flex-container pl-2">
                                                <span className="theme-text-h4">BTC</span>
                                                <span className="text-ellipsis" style={{color: "#888"}}>$ {(this.state.btc.balance * this.state.btc.value).toFixed(2)}</span>
                                            </div>
                                        </Col>
                                        <Col md="6" xs="5" className="no-p">
                                            <div className="height-100 flex-container pl-2">
                                                <span
                                                    className="theme-text-h4 color-green text-ellipsis">$ {this.state.btc.value.toFixed(2)}</span>
                                                <span className="text-ellipsis">{this.state.btc.balance.toFixed(5)}</span>
                                            </div>
                                        </Col>
                                    </Col>
                                    <Col md="3" xs="6" className="no-p height-100 mb-2">
                                        <Col md="2" xs="2" className="no-p height-100">
                                            <img style={{width: '100%'}} src="/assets/ethicon.png"/>
                                        </Col>
                                        <Col md="4" xs="5" className="height-100 no-p">
                                            <div className="height-100 flex-container pl-2">
                                                <span className="theme-text-h4">ETH</span>
                                                <span className="text-ellipsis" style={{color: "#888"}}>$ {(this.state.eth.balance * this.state.eth.value).toFixed(2)}</span>
                                            </div>
                                        </Col>
                                        <Col md="6" xs="5" className="no-p">
                                            <div className="height-100 flex-container pl-2">
                                                <span
                                                    className="theme-text-h4 color-green text-ellipsis">$ {this.state.eth.value.toFixed(2)}</span>
                                                <span className="text-ellipsis">{this.state.eth.balance.toFixed(5)}</span>
                                            </div>
                                        </Col>
                                    </Col>
                                    <Col md="3" xs="6" className="no-p height-100 mb-2">
                                        <Col md="2" xs="2" className="no-p height-100">
                                            <img style={{width: '100%'}} src="/assets/tusdicon.png"/>
                                        </Col>
                                        <Col md="4" xs="5" className="height-100 no-p">
                                            <div className="height-100 flex-container pl-2">
                                                <span className="theme-text-h4">TUSD</span>
                                                <span className="text-ellipsis" style={{color: "#888"}}>$ {(this.state.usd.balance * this.state.usd.value).toFixed(2)}</span>
                                            </div>
                                        </Col>
                                        <Col md="6" xs="5" className="no-p">
                                            <div className="height-100 flex-container pl-2">
                                                <span
                                                    className="theme-text-h4 color-green text-ellipsis">$ {this.state.usd.value.toFixed(2)}</span>
                                                <span className="text-ellipsis">{this.state.usd.balance.toFixed(5)}</span>
                                            </div>
                                        </Col>
                                    </Col>
                                </Col>
                            </div>
                        }
                    </div>
                </Col>
                <Col md="6" className="no-p">
                    <div className="p-3">
                        <DashboardBalanceWidget/>
                    </div>
                    <div className="p-3">
                        <KickOffCard/>
                    </div>
                </Col>
                <Col md="6" className="no-p">
                    <div className="p-3">
                        <DashboardTableStack/>
                    </div>
                </Col>
                <Col xs="12" className="no-p">
                    <DashboardBanner textMain="Explore more about BoH"/>
                </Col>
                <Col xs="12" className="no-p">
                    <Col md="3">
                        <div>
                            <DashWidgetCardLink imageUrl="../../assets/bandl_n.png" linkAddress="#"/>
                        </div>
                    </Col>
                    <Col md="3">
                        <div className="">
                            <DashWidgetCardLink imageUrl="../../assets/cryptocard_n.png" linkAddress="#"/>
                        </div>
                    </Col>
                    <Col md="3">
                        <div className="">
                            <DashWidgetCardLink imageUrl="../../assets/insurance_n.png" linkAddress="#"/>
                        </div>
                    </Col>
                    <Col md="3">
                        <div>
                            <DashWidgetCardLink imageUrl="../../assets/whitepaperdw_n.png" linkAddress="#"/>
                        </div>
                    </Col>
                </Col>

            </div>
        )
    }
}

export default Dashboard;
