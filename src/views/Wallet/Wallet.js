import React, {Component} from 'react';
import {Redirect} from 'react-router';
import AuthService from '../../AuthService';
import {Col, Container} from 'reactstrap';
import DashboardBanner from "../components/DashboardBanner";
import  Bitcoin from "../Coin/Bitcoin";
import  Ethereum from "../Coin/Ethereum";
import TrueUSD from "../Coin/TrueUSD";




const auth = new AuthService();
const mainTextHC = "";


class Wallet extends Component {
    constructor(props) {
        super(props);

        this.borLend = this.borLend.bind(this);
        this.bitcoinData = this.bitcoinData.bind(this);
        this.ethereumData = this.ethereumData.bind(this);
        this.usdData = this.usdData.bind(this);

        this.state = {
            redirect: false,
            redirectUrl: '',
            user: null,
            headText: "",
            btc: null,
            eth: null,
            usd: null,
            walletDataReceived: false
        };
    }

    borLend(){
        this.setState({redirect: true, redirectUrl: '/borrow-len'})
    }

    bitcoinData(data){
        if(data){
            if(this.state.eth != null && this.state.usd != null){
                var headText = "Wallet Balance $"+(this.state.eth.balance*this.state.eth.value+this.state.usd.balance*this.state.usd.value+data.balance*data.value).toFixed(2)
                this.setState({walletDataReceived: true, btc: data, headText: headText});
            }else{
                this.setState({btc: data})
            }
        }
    }

    ethereumData(data){
        if(data){
            console.log(data)
            if(this.state.btc != null && this.state.usd != null){
                var headText = "Wallet Balance $"+(this.state.btc.balance*this.state.btc.value+this.state.usd.balance*this.state.usd.value+data.balance*data.value).toFixed(2);
                this.setState({walletDataReceived: true, eth: data, headText: headText});
            }else{
                this.setState({eth: data})
            }
        }
    }

    usdData(data){
        if(data){
            if(this.state.btc != null && this.state.eth != null){
                var headText = "Wallet Balance $"+(this.state.btc.balance*this.state.btc.value+this.state.eth.balance*this.state.eth.value+data.balance*data.value).toFixed(2);
                this.setState({walletDataReceived: true, usd: data, headText: headText});
            }else{
                this.setState({usd: data})
            }
        }
    }

    componentDidMount(){
        if(!auth.loggedIn()){
            this.setState({redirect: true, redirectUrl: '/login'});
        }else{
            this.setState({user: auth.getProfile()});
        }
    }

    render() {
        if(this.state.redirect == true){
            return <Redirect to={{pathname: this.state.redirectUrl}} />
        }
        return (
            <div className="animated fadeIn height-100">
                <Col xs="12" className="no-p">
                    {
                        this.state.walletDataReceived?<DashboardBanner textMain={this.state.headText} button2Action={this.borLend} />
                            :null
                    }
                    <Col xs="12" className="table-container">
                        <Col xs="12" className="white-card no-p" >
                            <Col xs="12" className="table-head-row" >
                                <Col md="2" sm="6" xs="6"  className="no-p">
                                    <span className="theme-text-h4 table-head">Coin</span>
                                </Col>
                                <Col md="1" sm="6" xs="6" className="no-p">
                                    <span className="theme-text-h4 table-head">Balance</span>
                                </Col>
                                <Col md="1" className="no-p hidden-xs">
                                    <span className="theme-text-h4 table-head">Tokens</span>
                                </Col>
                                <Col md="2" className="no-p hidden-xs">
                                    <span className="theme-text-h4 table-head">Tokens Value</span>
                                </Col>
                                <Col md="5" className="no-p hidden-xs">
                                    <span className="theme-text-h4 table-head">Address</span>
                                </Col>
                                <Col md="1" className="no-p hidden-xs">
                                    <span className="theme-text-h4 table-head">Action</span>
                                </Col>
                            </Col>
                            <Col xs="12" className="no-pm">
                                <Bitcoin walletData={this.bitcoinData}/>
                            </Col>
                            <Col xs="12" className="no-pm">
                                <Ethereum walletData={this.ethereumData}/>
                            </Col>
                            <Col xs="12" className="no-pm">
                                <TrueUSD walletData={this.usdData}/>
                            </Col>
                        </Col>
                    </Col>



                </Col>
            </div>
        )
    }
}

export default Wallet;
