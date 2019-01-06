import React, {Component} from 'react';
import {Col, Container, Form, Row, Nav} from 'reactstrap';
import {Redirect} from 'react-router';
import SweetAlert from "react-bootstrap-sweetalert";
import {AppNavbarBrand} from '@coreui/react';
import ThemeFloatingLabel from '../../components/ThemeFloatingLabel';
import ThemeButton from '../../components/ThemeButton';
import AuthService from '../../../AuthService';

const auth = new AuthService();

class Register extends Component {

    constructor(props) {
        super(props);

        this.kid = props.match.params.kid;

        this.state = {
            error: '',
            id_btc: 'your_btc_id',
            id_eth: 'your_eth_id',
            id_trueusd: 'your_trueusd_id',
            redirect: false,
            redirectUrl: '/login',
            formError: false,
            formErrorMessage: '',
            loading: false,
            username: "",
            email: "",
            password: ""
        };
        this.CallApi = this.CallApi.bind(this);
        this.hideAlert = this.hideAlert.bind(this);
    }

    hideAlert() {
        this.setState({formError: false})
    }

    CallApi(e) {
        e.preventDefault();
        console.log(this.kid);
        let name = this.state.username;
        let email = this.state.email;
        let password = this.state.password;

        if (name == "" || email == "" || password == "") {
            this.setState({formError: true, formErrorMessage: 'All fields are required'});
        }
        else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.setState({formError: true, formErrorMessage: 'Please enter a valid email address'});
        }
        else {
            this.setState({loading: true});
            var body = {
                password: password,
                username: name,
                email: email,
                active: false,
                wallet: {},
                eth_label: name,
                btc_label: name,
                tusd_label: name
            };
            if(this.kid && this.kid !== ""){
                body['referralCode'] = this.kid;
            }
            auth.fetch('signup',{
                method: 'POST',
                body: JSON.stringify(body)
            }).then(res => {
                console.log(res);
                if(res.success){
                    this.setState({formError: false, redirect: true, loading: false, redirectUrl: '/thankyou'})
                }else{
                    this.setState({formError: true, loading: false, formErrorMessage: "Creation Failed"})
                }
            });
        }

    }

    componentDidMount(){
        document.title = "BoH - Sign up"
    }

    render() {

        if (this.state.redirect) {
            return <Redirect to={{pathname: this.state.redirectUrl}}/>;
        }

        return (
            <div className="app align-items-center intit-background">

                {
                    this.state.formError && this.state.formErrorMessage ? <SweetAlert title="Error!"
                                                                                      onConfirm={this.hideAlert}>{this.state.formErrorMessage} </SweetAlert>
                        : null
                }

                <Container className="">
                    <div>
                        <AppNavbarBrand className="mt-3" full={{src: "/assets/logo.png", width: '40%', height: 'auto', alt: 'BoH'}}/>
                        <Nav className="ml-auto pull-right" navbar>
                            <a className="mt-4 logout-link" href='#/login'>Sign in</a>
                        </Nav>
                    </div>
                    <Row>
                        <Col md="6" xs="12" className="p-5">

                            <Col md="3" xs="3" className="text-center">
                                <img className="milestone-icon" src="/assets/1signup.png"/>
                                <div><div className="vertical-line" style={{height: "50px"}} ></div></div>
                            </Col>
                            <Col md="9" xs="9" >
                                <div className="flex-container">
                                    <span className="theme-text-h4 text-bold">Sign up</span>
                                    <span className="theme-text-h4">Get 100 BoH tokens</span>
                                </div>
                            </Col>
                            <Col md="3" xs="3" className="text-center">
                                <img className="milestone-icon" src="/assets/2referfriends.png"/>
                                <div><div className="vertical-line" style={{height: "50px"}} ></div></div>
                            </Col>
                            <Col md="9" xs="9" >
                                <div className="flex-container" >
                                    <span className="theme-text-h4 text-bold">Refer friends</span>
                                    <span className="theme-text-h4">And get additional tokens</span>
                                </div>
                            </Col>
                            <Col md="3" xs="3" className="text-center">
                                <img className="milestone-icon" src="/assets/3milestone.png"/>
                            </Col>
                            <Col md="9" xs="9" >
                                <div className="flex-container" >
                                    <span className="theme-text-h4 text-bold">Reach milestones</span>
                                    <span className="theme-text-h4">For grand prize tokens</span>
                                </div>
                            </Col>



                        </Col>
                        <Col md="6" xs="12" className="p-5">
                            <div className="theme-text-h3 text-bold">Create your account</div>
                            <Form onSubmit={this.CallApi} className="mt-3">
                                <div>
                                    <ThemeFloatingLabel name="username" required={true} type="text" icon="people" placeholder="Username"
                                                        onChange={(event) => {
                                                            this.setState({username: event.target.value})}}/>
                                </div>
                                <div className="mt-theme-15" >
                                    <ThemeFloatingLabel name="email" required={true} type="email" icon="email" placeholder="Email" onChange={(event) => {
                                        this.setState({email: event.target.value}) }}/>
                                </div>
                                <div className="mt-theme-15" >
                                    <ThemeFloatingLabel name="password" required={true} type="password" icon="visibility_off" placeholder="Password"
                                                        onChange={(event) => {
                                                            this.setState({password: event.target.value}) }}/>
                                </div>
                                <div className="col-md-12 theme-text-h5 forgot-link text-center mt-theme-15" >
                                    <span>
                                        By clicking register, you agree our <a href="#">terms and conditions.</a>
                                    </span>
                                </div>
                                <div className="text-center col-md-12 mt-theme-15">
                                    {
                                        !this.state.loading && <ThemeButton buttonText="Sign up" buttonType="submit" buttonSize="medium"/>
                                    }
                                    {
                                        this.state.loading && <ThemeButton disabled={true} buttonText="Creating" buttonType="button" buttonSize="medium"/>
                                    }
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Register;
