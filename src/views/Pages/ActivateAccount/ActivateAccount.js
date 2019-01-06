import React, {Component} from 'react';
import {withHistory, Link} from 'react-router-dom'
import {Redirect} from 'react-router';
import AuthService from "../../../AuthService";

const auth = new AuthService();

class ActivateAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activationCode: props.match.params.code,
            redirectHome: false,
            activated: false,
            message: ""
        };
        this.activateAccount = this.activateAccount.bind(this);
    }

    componentDidMount() {
        if (auth.loggedIn()) {
            auth.fetch('get/user', {
                method: 'POST'
            }).then(response => {
                if (response.status !== 401) {
                    this.setState({redirectHome: true});
                }
            });
        }
        else {
            this.activateAccount();
        }
    }

    activateAccount() {
        auth.fetch('activateAccount',
            {
                method: 'POST',
                body: JSON.stringify({activationCode: this.state.activationCode})
            }).then(res => {
                console.log(res);
                if (res.success === true) {
                    this.setState({activated: true, redirectHome: true});
                } else {
                    this.setState({redirectHome: true, message: res.message})
                }
        });
    }

    render() {
        if (this.state.redirectHome) {
            return <Redirect to={{pathname: "/login", state: {activation: this.state.activated, message: this.state.message}}}/>;
        }

        return (
            <div className="app flex-row align-items-center"></div>
        );
    }
}

export default ActivateAccount;
