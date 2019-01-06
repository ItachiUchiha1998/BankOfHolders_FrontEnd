import React, {Component} from 'react';
import {
    Nav,
    Col,
    Container,
    Form,
    Row
} from 'reactstrap';
import {AppNavbarBrand} from '@coreui/react';
import SweetAlert from "react-bootstrap-sweetalert";
import {Redirect} from 'react-router';
import AuthService from '../../../AuthService';
import ThemeButton from '../../components/ThemeButton';
import ThemeFloatingLabel from '../../components/ThemeFloatingLabel';


const auth = new AuthService();

class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            redirectHome: false,
            loading: false,
            error: false,
            errorMessage: "",
            mailSent: false,
        };
        this.recoverAccount = this.recoverAccount.bind(this);
        this.hideAlert = this.hideAlert.bind(this);
        this.hideSuccessAlert = this.hideSuccessAlert.bind(this);
    }

    componentDidMount() {
        if(auth.loggedIn()){
            this.setState({redirectHome: true});
        }
        document.title = "BoH - Forgot password"
    }

    hideAlert() {
        this.setState({error: false, errorMessage: ''});
    }

    hideSuccessAlert() {
        this.setState({mailSent: false});
    }

    recoverAccount(e) {
        if (e) {
            e.preventDefault();
        }
        if (this.state.email === "" || !this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.setState({error: true, errorMessage: "Please enter valid email address"});
        }
        else {
            this.setState({loading: true});
            auth.fetch('forgotPassword',{
                method: "POST",
                body: JSON.stringify({email: this.state.email})
            }).then(res => {
                if (res.success === true) {
                    this.setState({mailSent: true, loading: false});
                } else {
                    this.setState({error: true, errorMessage: "Email address is not registered", loading: false});
                }
            })
        }
    }

    render() {
        if (this.state.redirectHome) {
            return <Redirect to={{pathname: "/dashboard",}}/>;
        }

        return (
            <div className="app flex-row align-items-center">
                {
                    (this.state.error && this.state.errorMessage) ?
                        <SweetAlert title="Error!" onConfirm={this.hideAlert}>{this.state.errorMessage}</SweetAlert>
                        : null
                }
                {
                    this.state.mailSent ?
                        <SweetAlert title="Success!" onConfirm={this.hideSuccessAlert}>Please check your
                            inbox!</SweetAlert>
                        : null
                }
                <Container className="intit-background">
                    <div>
                        <AppNavbarBrand className="mt-3" full={{src: "/assets/logo.png", width: '40%', height: 'auto', alt: 'BoH'}}/>
                        <Nav className="ml-auto pull-right" navbar>
                            <a className="mt-4 logout-link" href='#/login'>Sign in</a>
                        </Nav>
                    </div>
                    <Row className="justify-content-center">
                        <Col md="4" xs="12" className="p-3">
                            <Form onSubmit={this.recoverAccount} className="mt-5">
                                <ThemeFloatingLabel required={true} type="email" icon="people" placeholder="Email" onChange={(event) => {this.setState({email: event.target.value})}} />
                                <div className="text-center">
                                    {
                                        !this.state.loading && <ThemeButton buttonType="submit" buttonText="Recover" buttonSize="medium"/>
                                    }
                                    {
                                        this.state.loading && <ThemeButton disabled={true} buttonType="button" buttonText="Sending .." buttonSize="medium"/>
                                    }
                                </div>
                                <div className="theme-text-h5 forgot-link text-center mt-3">
                                    <span>
                                        If you remember.
                                    </span>
                                    <a href="#/login">Sign in</a>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ForgotPassword;
