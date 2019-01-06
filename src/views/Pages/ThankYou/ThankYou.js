import React, {Component} from 'react';
import {
    Nav,
    Col,
    Container,
    Form,
    Row
} from 'reactstrap';
import SweetAlert from "react-bootstrap-sweetalert";
import {Redirect} from 'react-router';
import AuthService from '../../../AuthService';
import {AppNavbarBrand} from '@coreui/react';
import ThemeFloatingLabel from '../../components/ThemeFloatingLabel';
import ThemeButton from '../../components/ThemeButton';





const auth = new AuthService();

class ThankYou extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            redirectHome: false,
            username: "",
            password: "",
            error: false,
            wrong: false,
            errorMessage: props.location.state?props.location.state.message : null,
            activation: props.location.state ? props.location.state.activation : null
        };
        this.login = this.login.bind(this);
        this.hideAlert = this.hideAlert.bind(this);
        this.hidePasswordAlert = this.hidePasswordAlert.bind(this);
    }

    hideAlert() {
        this.setState({error: false})
    }

    hidePasswordAlert() {
        this.setState({wrong: false})
    }

    login(e) {
        if (e) {
            e.preventDefault();
        }
        if (this.state.username === "" || this.state.password === "") {
            this.setState({error: true, errorMessage: "Please enter username & password"});
        } else {
            this.setState({loading: true})
            auth.login(this.state.username, this.state.password).then((response) => {
                console.log(response);
                this.setState({redirectHome: true})
            }, (error) => {
                console.log(error);
                if (error.msg) {
                    this.setState({wrong: true, message: error.msg, loading: false});
                } else {
                    this.setState({error: true, loading: false});
                }
            });
        }
    }

    componentDidMount(){
        document.title = "BoH - Thank you"
    }

    render() {


        if (auth.loggedIn()) {
            return <Redirect to={{pathname: "/dashboard",}}/>;
        }

        return (
            <div className="app flex-row align-items-center">
                {
                    this.state.error ?
                        <SweetAlert title="Error!" onConfirm={this.hideAlert}>{this.state.errorMessage}</SweetAlert>
                        : <p></p>
                }
                {
                    this.state.wrong ? <SweetAlert title="Error!"
                                                   onConfirm={this.hidePasswordAlert}> {this.state.message ? this.state.message : 'Invalid Credentials'} </SweetAlert>
                        : <p></p>
                }
                {
                    this.state.activation === true ?
                        <SweetAlert title="Success" onConfirm={() => this.setState({activation: null})}> Congratulations
                            your account is activated! </SweetAlert>
                        : this.state.activation === false ?
                        <SweetAlert title="Error!" onConfirm={() => this.setState({activation: null})}> {this.state.errorMessage}</SweetAlert>
                        : <p></p>
                }
                <Container className="intit-background">
                    <div>
                        <AppNavbarBrand className="mt-3" full={{src: "/assets/logo.png", width: '40%', height: 'auto', alt: 'BoH'}}/>
                    </div>
                    <Row className="justify-content-center mt-theme-30 flex-container text-center">
                        <span className="theme-text-h2 text-bold">Thank you for signing up!</span>
                        <span className="theme-text-h3">Please follow the steps to comlete the process</span>
                        <div className="d-inline-block mt-theme-60">
                            <img src="/assets/numbers/1.png" className="step-numbering-img" />
                            <span className="theme-text-h5 step-span">Check your email inbox</span>
                            <div className="h-line"></div>

                            <img src="/assets/numbers/2.png" className="step-numbering-img" />
                            <span className="theme-text-h5 step-span">Open the confirmation email</span>
                            <div className="h-line"></div>

                            <img src="/assets/numbers/3.png" className="step-numbering-img" />
                            <span className="theme-text-h5 step-span">Click the confirmation link</span>
                        </div>
                        <div className="d-inline-block mt-theme-60">
                            <span className="theme-text-h4">Any trouble, please <a href="#">click here</a>.</span>
                        </div>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ThankYou;
