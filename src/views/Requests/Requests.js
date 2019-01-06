import React, {Component} from 'react';
import SweetAlert from "react-bootstrap-sweetalert";
import {Redirect} from 'react-router';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import matchSorter from 'match-sorter';
import ThemeButton from "../components/ThemeButton";
import AuthService from "../../AuthService";
import {Dropdown, DropdownToggle, DropdownItem, DropdownMenu} from 'reactstrap';
import axios from "axios/index";


const auth = new AuthService();
const coinLegend = {
    "Bitcoin": "BTC",
    "Ethereum": "ETH",
    "TrueUSD": "TUSD"
}

class Requests extends Component {

    constructor(props) {
        super(props);

        this.state = {
            redirect: false,
            redirectUrl: '',
            data: [],
            current_data: [],
            placed: false,
            deleted: false,
            loading: true,
            send: 'ok',
            id: "",
            user: null,
            error: "",
            filterToggle: false,
            sorted: [],
            filtered: [],
            Bitcoin: null,
            Ethereum: null,
            TrueUSD: null,
            loadingIndex: null

        }
        this.toggle = this.toggle.bind(this);
        this.hideSuccess = this.hideSuccess.bind(this);
        this.hideError = this.hideError.bind(this);
        this.hideDelete = this.hideDelete.bind(this);
        this.getWalletData = this.getWalletData.bind(this);
    }

    getWalletData() {
        auth.fetch('btc/get', {
            method: 'POST',
            body: JSON.stringify({id: auth.getProfile().wallet.btc})
        }).then(res => {
            return axios.get('https://api.coinmarketcap.com/v2/ticker/?convert=BTC&limit=1')
                .then(res2 => {
                    var price = res2.data.data[1].quotes['USD'].price / res2.data.data[1].quotes['BTC'].price;
                    this.setState({
                        Bitcoin: {
                            balance: parseFloat(res.balance),
                            address: res.address,
                            value: price
                        },
                        sattousd: price * .00000001
                    });
                    if (this.state.Ethereum !== null && this.state.TrueUSD !== null) {
                        this.CallReadApi();
                    }
                })


        });
        auth.fetch('trueusd/get', {
            method: "POST",
            body: JSON.stringify({id: auth.getProfile().wallet.trueusd})
        }).then(res => {
            return axios.get('https://api.coinmarketcap.com/v2/ticker/?convert=TUSD&limit=1')
                .then(res2 => {
                    var price = res2.data.data[1].quotes['USD'].price / res2.data.data[1].quotes['TUSD'].price;
                    this.setState({
                        TrueUSD: {
                            balance: parseFloat(res.balance),
                            address: res.address,
                            value: price
                        }
                    });
                    if (this.state.Ethereum !== null && this.state.Bitcoin !== null) {
                        this.CallReadApi();
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
                    var price = res2.data.data[1].quotes['USD'].price / res2.data.data[1].quotes['ETH'].price;

                    this.setState({
                        Ethereum: {
                            balance: parseFloat(res.balance),
                            address: res.address,
                            value: price
                        }
                    });
                    if (this.state.Bitcoin !== null && this.state.TrueUSD !== null) {
                        this.CallReadApi();
                    }
                })
        });
    }

    toggle() {
        this.setState({filterToggle: !this.state.filterToggle})
    }

    CallReadApi() {
        auth.fetch('lendrequest/get', {
            method: "POST"
        }).then(res => {
            for (var each in res.data) {
                res.data[each].amount = parseFloat(res.data[each].amount);
                res.data[each].interestRate = parseInt(res.data[each].interestRate);
                res.data[each].months = parseInt(res.data[each].months)
            }
            this.setState({data: res.data, current_data: res.data, loading: false});
        });
    }

    hideSuccess() {
        this.setState({placed: false})
    }

    hideDelete() {
        this.setState({deleted: false})
    }

    Order = (i) => (e) => {
        this.setState({loadingIndex: i})
        if (this.state.data[i].orderType === 'Borrow') {
            auth.fetch('agreement/create/borrow', {
                method: 'POST',
                body: JSON.stringify({
                    borrower: this.state.user._id,
                    orderid: this.state.data[i]._id,
                    CollateralCoinType: this.state.data[i].CollateralCoinType
                })
            }).then(res => {
                console.log(res);
                if (res.success == true) {
                    this.setState({placed: true})
                } else {
                    this.setState({send: 'false', loading: false, error: "" /*JSON.stringify(res)*/})
                }
            })
        } else {
            auth.fetch('agreement/create/lend', {
                method: 'POST',
                body: JSON.stringify({
                    lender: this.state.user._id,
                    orderid: this.state.data[i]._id
                })
            }).then(res => {
                console.log(res);
                if (res.success == true) {
                    this.setState({placed: true, loadingIndex: null})
                } else {
                    this.setState({send: 'false', loading: false, error: res.error, loadingIndex: null})
                }
            })
        }
    }

    hideError() {
        this.setState({send: 'true'})
    }

    Delete = (i) => (e) => {
        this.setState({loadingIndex: i})
        auth.fetch('lendrequest/delete', {
            method: 'POST',
            body: JSON.stringify({
                orderid: this.state.data[i]._id,
            })
        }).then(res => {
            console.log(res);
            if (res.success == true) {
                this.setState({deleted: true, loadingIndex: null});
                this.CallReadApi();
            }else{
                this.setState({loadingIndex: null});
            }
        })
    }

    componentDidMount() {
        this.setState({user: auth.getProfile()});
        this.getWalletData();
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={{pathname: this.state.redirectUrl}}/>
        }
        if (this.state.loading) {
            return <span className="theme-text-h4">Loading ...</span>
        }

        const {data} = this.state;

        return (
            <div className="animated fadeIn col-md-12">
                {
                    this.state.placed == true ?
                        <SweetAlert title="Success!" onConfirm={this.hideSuccess}>Order Placed</SweetAlert>
                        : null
                }
                {
                    this.state.send == 'false' ?
                        <SweetAlert title="Error!" onConfirm={this.hideError}>Error <br></br> {this.state.error}
                        </SweetAlert>
                        : null
                }
                {
                    this.state.deleted == true ?
                        <SweetAlert title="Success!" onConfirm={this.hideDelete}>Order Cancelled</SweetAlert>
                        : null
                }
                <div className="theme-text-h2 mt-theme-30 d-inline-block">
                    Requests
                </div>
                <div className="pull-right mt-theme-30">
                    <Dropdown className="d-inline-block" isOpen={this.state.filterToggle} toggle={this.toggle}>
                        <DropdownToggle className="filter-drop">
                            <span className="theme-text-h4 p-1">
                                Filter by <span className="material-icons ml-5 v-align-middle">filter_list</span>
                            </span>
                        </DropdownToggle>
                        <DropdownMenu className="filter-menu">
                            <DropdownItem onClick={() => {
                                this.setState({filtered: [{id: 'orderType', value: 'Borrow'}], sorted: []})
                            }}>
                                Borrowing
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                                this.setState({filtered: [{id: 'orderType', value: 'Lend'}], sorted: []})
                            }}>
                                Lending
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                                this.setState({sorted: [{id: 'interestRate', desc: false}], filtered: []})
                            }}>
                                Interest Rate
                                <span className="pull-right">
                                    <i style={{fontSize: '15px', color: "black"}}
                                       className="material-icons">arrow_upward</i>
                                    <br/>
                                    <span className="theme-text-h6">low - high</span>
                                </span>
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                                this.setState({sorted: [{id: 'interestRate', desc: true}], filtered: []})
                            }}>
                                Interest Rate
                                <span className="pull-right">
                                    <i style={{fontSize: '15px', color: "black"}}
                                       className="material-icons">arrow_downward</i>
                                    <br/>
                                    <span className="theme-text-h6">high - low</span>
                                </span>
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                                this.setState({sorted: [{id: 'months', desc: false}], filtered: []})
                            }}>
                                Months
                                <span className="pull-right">
                                    <i style={{fontSize: '15px', color: "black"}}
                                       className="material-icons">arrow_upward</i>
                                    <br/>
                                    <span className="theme-text-h6">low - high</span>
                                </span>
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                                this.setState({sorted: [{id: 'months', desc: true}], filtered: []})
                            }}>
                                Months
                                <span className="pull-right">
                                    <i style={{fontSize: '15px', color: "black"}}
                                       className="material-icons">arrow_downward</i>
                                    <br/>
                                    <span className="theme-text-h6">high - low</span>
                                </span>
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                                this.setState({filtered: [{id: 'CollateralCoinType', value: 'Bitcoin'}], sorted: []})
                            }}>
                                Collateral BTC
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                                this.setState({filtered: [{id: 'CollateralCoinType', value: 'Ethereum'}], sorted: []})
                            }}>
                                Collateral ETH
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                                this.setState({filtered: [{id: 'CollateralCoinType', value: 'TrueUSD'}], sorted: []})
                            }}>
                                Collateral TUSD
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <ThemeButton onClick={(e) => {
                        this.setState({redirect: true, redirectUrl: '/borrow-len'})
                    }} buttonText="Create New"/>
                </div>

                <div className="white-card w-100 no-p mt-theme-30">
                    <div className="container no-pm theme-table">
                        <ReactTable
                            data={data}
                            filterable={true}
                            sortable={true}
                            pageSize={data.length || 3}
                            defaultFilterMethod={function (filter, row) {
                                String(row[filter.id]) === filter.value;
                            }}
                            columns={[
                                {
                                    columns: [
                                        {
                                            Header: "Order Type",
                                            accessor: "orderType",
                                            filterMethod: (filter, rows) =>
                                                matchSorter(rows, filter.value, {keys: ["orderType"]}),
                                            filterAll: true,
                                            maxWidth: 175
                                        },
                                        {
                                            Header: "Amount",
                                            accessor: "amount",
                                            minWidth: 150,
                                            filterMethod: (filter, rows) =>
                                                matchSorter(rows, filter.value, {keys: ["amount"]}),
                                            filterAll: true,
                                            Cell: ({index}) => (
                                                <div>
                                                    <img className={data[index].coinType}/>
                                                    <span>{((data[index].amount * this.state.sattousd) / (this.state[data[index].coinType].value)).toFixed(5)}</span>
                                                    <span> {coinLegend[data[index].coinType]}</span>
                                                </div>
                                            )
                                        },
                                        {
                                            Header: "Interest Rate",
                                            accessor: "interestRate",
                                            filterMethod: (filter, rows) =>
                                                matchSorter(rows, filter.value, {keys: ["interestRate"]}),
                                            filterAll: true,
                                            maxWidth: 150
                                        },
                                        {
                                            Header: "Months",
                                            accessor: "months",
                                            filterMethod: (filter, rows) =>
                                                matchSorter(rows, filter.value, {keys: ["months"]}),
                                            filterAll: true,
                                            maxWidth: 150
                                        },
                                        /*{
                                            Header: "Receiving Coin",
                                            accessor: "coinType",
                                            filterMethod: (filter, rows) =>
                                                matchSorter(rows, filter.value, {keys: ["coinType"]}),
                                            filterAll: true,
                                            Cell: ({index}) => (
                                                <div>
                                                    <img className={data[index].coinType}/>
                                                    <span>{data[index].coinType}</span>
                                                </div>
                                            )
                                        },*/
                                        {
                                            Header: "Collateral Coin",
                                            accessor: "CollateralCoinType",
                                            filterMethod: (filter, rows) =>
                                                matchSorter(rows, filter.value, {keys: ["CollateralCoinType"]}),
                                            filterAll: true,
                                            minWidth: 150,
                                            Cell: ({index}) => (
                                                <div>
                                                    <img className={data[index].CollateralCoinType}/>
                                                    {
                                                        data[index].CollateralCoinAmount &&
                                                        <span>
                                                            <span>{parseFloat(data[index].CollateralCoinAmount).toFixed(5)}</span>
                                                            <span> {coinLegend[data[index].CollateralCoinType]}</span>
                                                        </span>
                                                    }
                                                    {
                                                        !data[index].CollateralCoinAmount && <span>-</span>
                                                    }
                                                </div>
                                            )
                                        },
                                        {
                                            Header: "Request",
                                            id: 'request_state',
                                            filterable: false,
                                            sortable: false,
                                            maxWidth: 100,
                                            Cell: ({index}) => (
                                                <div>
                                                    {
                                                        this.state.user._id === data[index].userid && this.state.loadingIndex !== index &&
                                                        <ThemeButton buttonText="Cancel" theme="negative"
                                                                     onClick={this.Delete(index)}
                                                                     buttonSize="small"/>
                                                    }
                                                    {
                                                        this.state.user._id === data[index].userid && this.state.loadingIndex === index &&
                                                        <ThemeButton disabled={true} buttonText="Cancelling.." theme="negative"
                                                                     buttonSize="small"/>
                                                    }
                                                    {
                                                        this.state.user._id !== data[index].userid && this.state.loadingIndex !== index &&
                                                        <ThemeButton buttonText="Accept"
                                                                     onClick={this.Order(index)}
                                                                     buttonSize="small" />
                                                    }
                                                    {
                                                        this.state.user._id !== data[index].userid && this.state.loadingIndex === index &&
                                                        <ThemeButton disabled={true} buttonText="Accepting..." buttonSize="small"/>
                                                    }


                                                    {/*{
                                                        this.state.user._id == data[index].userid ?
                                                            <ThemeButton buttonText="Cancel" theme="negative"
                                                                         onClick={this.Delete(index)}
                                                                         buttonSize="small">
                                                                CANCEL
                                                            </ThemeButton>
                                                            : <ThemeButton buttonText="Accept"
                                                                           onClick={this.Order(data[index]._id, data[index].orderType, data[index].CollateralCoinType)}
                                                                           buttonSize="small">
                                                                ORDER
                                                            </ThemeButton>
                                                    }*/}
                                                </div>
                                            )
                                        }
                                    ]
                                }
                            ]}
                            showPagination={false}
                            className="-highlight"
                            sortable={false}
                            sorted={this.state.sorted}
                            filtered={this.state.filtered}

                        />
                    </div>
                </div>

            </div>
        );
    }
}

export default Requests;
