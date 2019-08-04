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

class Login extends Component {
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
                this.setState({redirectHome: true})
            }, (error) => {
                if (error.msg) {
                    this.setState({wrong: true, message: error.msg, loading: false});
                } else {
                    this.setState({error: true, loading: false});
                }
            });
        }
    }

    componentDidMount(){
        document.title = "BoH - Sign in"
    }


    render() {


        if (auth.loggedIn()) {
            return <Redirect to={{pathname: "/dashboard",}}/>;
        }

        return (
            <div className="app intit-background align-items-center">
                {
                    this.state.error ?
                        <SweetAlert title="Error!" onConfirm={this.hideAlert}>{this.state.errorMessage}</SweetAlert>
                        : null
                }
                {
                    this.state.wrong ? <SweetAlert title="Error!"
                                                   onConfirm={this.hidePasswordAlert}> {this.state.message ? this.state.message : 'Invalid Credentials'} </SweetAlert>
                        : null
                }
                {
                    this.state.activation === true ?
                        <SweetAlert title="Success" onConfirm={() => this.setState({activation: null})}> Congratulations
                            your account is activated! </SweetAlert>
                        : this.state.activation === false ?
                        <SweetAlert title="Error!" onConfirm={() => this.setState({activation: null})}> {this.state.errorMessage}</SweetAlert>
                        : null
                }
                <Container>
                    <div>
                        <AppNavbarBrand className="mt-3" full={{src: "/assets/logo.png", width: '40%', height: 'auto', alt: 'BoH'}}/>
                        <Nav className="ml-auto pull-right" navbar>
                            <a className="mt-4 logout-link" href='#/register'>Sign up</a>
                        </Nav>
                    </div>
                    <Row className="justify-content-center">
                        <Col md="4" xs="12" className="p-3">
                            <div className="theme-text-h3 text-bold mt-theme-15">Sign in to your account</div>
                            <Form onSubmit={this.login} className="mt-3">
                                <div>
                                    <ThemeFloatingLabel required={true} type="text" icon="people" placeholder="Username" onChange={(event) => {this.setState({username: event.target.value})}} />
                                </div>
                                <div className="mt-theme-15">
                                    <ThemeFloatingLabel required={true} type="password" icon="visibility_off" placeholder="Password" onChange={(event) => {this.setState({password: event.target.value})}} />
                                </div>
                                <div>
                                    <a className="pull-right logout-link" href="#/forgotPassword">Forgot ?</a>
                                </div>
                                <div className="text-center col-md-12">
                                    {
                                        !this.state.loading && <ThemeButton buttonType="submit" buttonText="Sign in" buttonSize="medium"/>
                                    }
                                    {
                                        this.state.loading && <ThemeButton buttonType="button" disabled={true} buttonText="Signing in ..." buttonSize="medium"/>
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

export default Login;
