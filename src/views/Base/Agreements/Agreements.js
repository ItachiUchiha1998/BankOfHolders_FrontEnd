import React, {Component} from 'react';
import {withHistory, Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import matchSorter from 'match-sorter';
import config from '../../../client-config';
import AuthService from "../../../AuthService";
import Moment from 'react-moment';
import axios from "axios/index";

const auth = new AuthService();
const coinLegend = {
    "Bitcoin": "BTC",
    "Ethereum": "ETH",
    "TrueUSD": "TUSD"
}

class Agreements extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            user: null,
            loading: true,
            Bitcoin: null,
            Ethereum: null,
            TrueUSD: null,
            sattousd: 1
        }

        this.CallReadApi = this.CallReadApi.bind(this);
        this.getWalletData = this.getWalletData.bind(this);
    }

    CallReadApi() {
        this.setState({user: auth.getProfile()});
        auth.fetch('agreement/get',{
            method: "POST",
            body: JSON.stringify({id: auth.getProfile()._id})
        }).then(res => {
            for(var each in res.data){
                res.data[each].createdOn = new Date(res.data[each].createdOn).toDateString();
            }
            this.setState({data: res.data, loading: false});
        })
    }

    getWalletData() {
        auth.fetch('btc/get', {
            method: 'POST',
            body: JSON.stringify({id: auth.getProfile().wallet.btc})
        }).then(res => {
            return axios.get('https://api.coinmarketcap.com/v2/ticker/?convert=BTC&limit=1')
                .then(res2 => {
                    var price = res2.data.data[1].quotes['USD'].price/res2.data.data[1].quotes['BTC'].price;
                    this.setState({
                        Bitcoin: {
                            balance: parseFloat(res.balance),
                            address: res.address,
                            value: price
                        },
                        sattousd: price*.00000001
                    });
                    if(this.state.Ethereum !== null && this.state.TrueUSD !== null){
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
                    var price = res2.data.data[1].quotes['USD'].price/res2.data.data[1].quotes['TUSD'].price;
                    this.setState({
                        TrueUSD: {
                            balance: parseFloat(res.balance),
                            address: res.address,
                            value: price
                        }
                    });
                    if(this.state.Ethereum !== null && this.state.Bitcoin !== null){
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
                    var price = res2.data.data[1].quotes['USD'].price/res2.data.data[1].quotes['ETH'].price;

                    this.setState({
                        Ethereum: {
                            balance: parseFloat(res.balance),
                            address: res.address,
                            value: price
                        }
                    });
                    if(this.state.Bitcoin !== null && this.state.TrueUSD !== null){
                        this.CallReadApi();
                    }
                })
        });
    }

    componentDidMount() {
        this.getWalletData();
    }

    render() {
        if (this.state.loading){
            return <span className="theme-text-h4">Loading ...</span>
        }
        const {data} = this.state;
        return (
            <div className="animated fadeIn col-md-12">
                <div className="theme-text-h2 mt-theme-30 d-inline-block">
                    Agreements
                </div>
                <div className="white-card w-100 no-p mt-theme-30">
                    <div className="container no-pm theme-table">
                        <ReactTable
                            data={data}
                            pageSize={data.length || 3}
                            columns={[
                                {
                                    columns: [
                                        {
                                            Header: "Date",
                                            accessor: "createdOn",
                                            maxWidth: 150
                                        },
                                        {
                                            Header: "Lender Id",
                                            accessor: "lenderId"
                                        },
                                        {
                                            Header: "Borrower Id",
                                            accessor: "borrowerId"
                                        },
                                        {
                                            Header: "Lending Coin",
                                            accessor: "lendingCoin",
                                            minWidth: 125,
                                            Cell:({index}) => (
                                                <div>
                                                    <img className={data[index].lendingCoin} />
                                                    <span>{data[index].lendingAmount.toFixed(5)}</span>
                                                    <span>{coinLegend[data[index].lendingCoin]}</span>

                                                </div>
                                            )
                                        },
                                        {
                                            Header: "Months",
                                            accessor: "noOfMonths",
                                            maxWidth: 100
                                        },
                                        {
                                            Header: "Interest",
                                            accessor: "InterestRate",
                                            maxWidth: 100,
                                            Cell:({index}) => (
                                                <div>
                                                    <span>{data[index].InterestRate} %</span>
                                                </div>
                                            )
                                        }
                                        /*{
                                            Header: "Next Payment Date",
                                            accessor: "nextPayment",
                                            filterMethod: (filter, rows) =>
                                                matchSorter(rows, filter.value, {keys: ["nextPayment"]}),
                                            filterAll: true,
                                            Cell: ({index}) => (
                                                <div>
                                                    <span>
                                                        <Moment format="DD/MM/YYYY">
                                                            {data[index].nextPayment}
                                                        </Moment>
                                                    </span>
                                                </div>
                                            )
                                        },
                                        {
                                            Header: "Next Payment Amount",
                                            accessor: "nextPaymentAmount",
                                            Cell: ({index}) => (
                                                <div>
                                                    <img className={data[index].CollateralCoinType} />
                                                    <span>
                                                        {((data[index].lendingAmount / data[index].noOfMonths)*((100 + data[index].InterestRate)/100)).toFixed(5)}
                                                    </span>
                                                </div>
                                            )
                                        }*/
                                    ]
                                }
                            ]}
                            sortable={false}
                            showPagination={false}
                            className="-highlight"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Agreements;

