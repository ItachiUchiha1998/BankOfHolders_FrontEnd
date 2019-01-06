import React, {Component} from 'react';
import QRCode from 'qrcode.react';
import {Collapse, Col, Dropdown, DropdownToggle, DropdownItem, DropdownMenu} from 'reactstrap';
import SweetAlert from "react-bootstrap-sweetalert";
import AuthService from "../../../AuthService";
import ThemeButton from "../../components/ThemeButton";
import ThemeFloatingLabel from "../../components/ThemeFloatingLabel";
import axios from "axios/index";

const auth = new AuthService();

class Ethereum extends Component {

    constructor(props) {
        super(props);

        this.transfer = this.transfer.bind(this);
        this.hideAlert = this.hideAlert.bind(this);
        this.hideWarning = this.hideWarning.bind(this);
        this.copy = this.copy.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);

        this.state = {
            user: null,
            id: "",
            balance: 0,
            address: 'Loading..',
            value: '',
            send: '',
            nullvalue: false,
            redirectLogin: false,
            collapse: false,
            copied: false,
            receiverAddress: "",
            amountSending: 0,
            dropdown: false,
            error: false
        }


    }

    copy() {
        var copyText = document.getElementById('addressInputETH');
        copyText.select();
        var address= this.state.address;
        this.setState({copied: document.execCommand("copy"), address: "Your ETH address copied"});
        setTimeout(() => {
            this.setState({copied: false, address: address});
        }, 5000);
    }

    hideAlert() {
        this.setState({send: ''})
    }

    hideWarning() {
        this.setState({nullvalue: false})
    }

    getData() {
        this.setState({user: auth.getProfile(), id: auth.getProfile().wallet.eth});
        auth.fetch('eth/get',{
            method: "POST",
            body: JSON.stringify({
                id: auth.getProfile().wallet.eth
            })
        }).then(res => {

            return axios.get('https://api.coinmarketcap.com/v2/ticker/?convert=ETH&limit=1')
                .then(res2 => {
                    var price = res2.data.data[1].quotes['USD'].price/res2.data.data[1].quotes['ETH'].price;
                    this.setState({balance: parseFloat(res.balance), address: res.address, value: price});
                    this.props.walletData({balance: parseFloat(res.balance), address: res.address, value: price});
                })
        });
    }


    transfer(e) {
        e.preventDefault();
        let receiverAddress = this.state.receiverAddress;
        let receiverAmount = this.state.amountSending;

        if (receiverAmount == "" || receiverAddress == "") {
            this.setState({nullvalue: true});
        } else {
            this.setState({loading: true});
            auth.fetch('eth/send',{
                method: "POST",
                body: JSON.stringify({
                    id: this.state.user.wallet.eth,
                    destinationAddress: receiverAddress,
                    amountSatoshis: receiverAmount
                })
            }).then(res => {
                if (res.success == true) {
                    this.setState({send: 'true', loading: false})
                } else {
                    this.setState({send: 'false', loading: false,error: res.error.result.error})
                }
            })
        }

    }

    changeUpdate = (e) => {
        switch (e.target.name){
            case "addressInputETH":
                e.target.value = this.state.address;
                break;
            default:
                this.setState({
                    [e.target.name]: e.target.value
                })
        }
    };

    toggle() {
        this.setState({collapse: !this.state.collapse});
    }

    toggleDropdown(){
        this.setState({dropdown: !this.state.dropdown});
    }

    componentDidMount() {
        this.getData()
    }

    render() {
        return (
            <div className="animated fadeIn no-pm">
                {
                    this.state.nullvalue ?
                        <SweetAlert title="Error!" onConfirm={this.hideWarning}>All fields are required </SweetAlert>
                        : null
                }
                {
                    this.state.send == 'false' ?
                        <SweetAlert title="Error!" onConfirm={this.hideAlert}>Error occured in Transacting<br></br>
          {this.state.error}
                        </SweetAlert>
                        : null
                }
                {
                    this.state.send == 'true' ?
                        <SweetAlert title="Success!" onConfirm={this.hideAlert}>Successful Transaction
                        </SweetAlert>
                        : null
                }

                <div className="wallet-row">
                    <Col xs="12" className="table-row" >
                        <Col md="2" sm="6" xs="6" className="h-100 no-p">
                            <div className="flex-container pl-3">
                                <div className="d-inline-block">
                                    <img className="coin-icon" src="/assets/ethicon.png" /> ETH (Ethereum)
                                </div>
                            </div>
                        </Col>
                        <Col md="1" sm="6 pl-3" xs="6" className="h-100 no-p">
                            <div className="flex-container pl-3">
                                $ {(this.state.balance*this.state.value).toFixed(2)}
                            </div>
                        </Col>
                        <Col md="1" className="hidden-xs h-100 no-p">
                            <div className="flex-container pl-3">
                                {this.state.balance.toFixed(5)}
                            </div>
                        </Col>
                        <Col md="2" className="hidden-xs h-100 no-p">
                            <div className="flex-container pl-3">
                                {parseFloat(this.state.value).toFixed(2)} $
                            </div>
                        </Col>
                        <Col md="5" className="hidden-xs h-100 no-p">
                            <div className="flex-container pl-2">
                                <div className="d-inline-block w-100">
                                    <input readOnly id="addressInputETH" name="addressInputETH" onChange={this.changeUpdate} className="theme-text-h6 p-1" disabled={false} style={{height: "30px", color: this.state.copied?"blue":"black", border: 'none'}} value={this.state.address} />
                                    <div className="pull-right display-inb v-align-middle">
                                        {
                                            this.state.copied && <ThemeButton disabled={this.state.copied} onClick={this.copy} theme="negative" buttonText="Copy" buttonSize="small"/>
                                        }
                                        {
                                            !this.state.copied && <ThemeButton disabled={this.state.copied} onClick={this.copy} theme="negative" buttonText="Copy" buttonSize="small"/>
                                        }
                                        <Dropdown className="no-pm d-inline-block" isOpen={this.state.dropdown} toggle={this.toggleDropdown}>
                                            <DropdownToggle disabled={this.state.dropdown} className="no-m theme-btn negative small">
                                                Scan
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                                <DropdownItem header className="white-card no-p">
                                                    <div className="scan-card-head theme-text-h4">
                                                        Scan your ETH address
                                                    </div>
                                                    <div className="scan-card-body">
                                                        <QRCode value={this.state.address}/>
                                                    </div>
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>

                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md="1" className="h-100 no-p">
                            <div className="flex-container p-1">
                                {
                                    this.state.collapse && <ThemeButton buttonText="Cancel" buttonSize="small" onClick={this.toggle} />
                                }
                                {
                                    !this.state.collapse && <ThemeButton buttonText="Send ETH" buttonSize="small" onClick={this.toggle} />
                                }
                            </div>
                        </Col>
                    </Col>
                    <Collapse isOpen={this.state.collapse} >
                        <Col xs="12" className="collapse-container">
                            <div className="theme-text-h3 mt-5">
                                <span style={{verticalAlign: "middle"}} >Send </span><span style={{fontWeight: "600", verticalAlign: "middle"}} >ETH </span><img style={{width: "25px"}} src="/assets/ethicon.png"/>
                            </div>
                            <Col xs="12" md="3" className="pr-1">
                                <ThemeFloatingLabel type="text" onChange={this.changeUpdate} name="receiverAddress" icon="account_balance_wallet" placeholder="Receiver wallet address"/>
                            </Col>
                            <Col xs="12" md="3" className="pr-1">
                                <ThemeFloatingLabel type="tel" onChange={this.changeUpdate} name="amountSending" icon="money" placeholder="Amount" />
                            </Col>
                            <Col xs="12" md="1" className="no-p" >
                                <div className="w-100 h-100" style={{paddingTop: "1rem"}}>
                                    <ThemeButton onClick={this.transfer} theme="primary" buttonText="Send" />
                                </div>
                            </Col>
                        </Col>
                    </Collapse>
                </div>
            </div>
        );
    }
}

export default Ethereum;
