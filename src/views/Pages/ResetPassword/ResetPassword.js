import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { withHistory, Link } from 'react-router-dom'
import SweetAlert from "react-bootstrap-sweetalert";
import { Redirect } from 'react-router';
import config from '../../../client-config';
import AuthService from "../../../AuthService";


const auth = new AuthService();

class ResetPassword extends Component {

  constructor(props){
    super(props);
    console.log(props.match.params.hash);
    this.state = {
        hash: props.match.params.hash,
        redirectHome: false,
        error: false,
        errorMessage: "",
        newPassword: "",
        confirmPassword: "",
        passwordChanged: false,
        redirect404: false,
    };
    this.hideAlert = this.hideAlert.bind(this);
    this.hideSuccessAlert = this.hideSuccessAlert.bind(this);
    this.recoverAccount = this.recoverAccount.bind(this);
  }

    componentDidMount() {
        if (localStorage.getItem('jwt')) {
            auth.fetch('get/user', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('jwt')
                },
            }).then(response => {
                if (response.status !== 401) {
                    this.setState({ redirectHome: true });
                }
            });
        }
        auth.fetch('checkHash', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ hash: this.state.hash })
        }).then(response => {
            if (response.status === 401) {
                this.setState({ redirect404: true });
            }
        });
    }

  hideAlert(){
      this.setState({error: false, errorMessage: ''});
  }

  hideSuccessAlert(){
      this.setState({passwordChanged: false, redirectHome: true});
  }

    recoverAccount(e) {
        if (e) {
            e.preventDefault();
        }
        if (this.state.newPassword === "" || this.state.confirmPassword === "") {
            this.setState({ error: true, errorMessage: "Please enter new password" });
        }
        else if (this.state.newPassword !== this.state.confirmPassword) {
            this.setState({ error: true, errorMessage: "Password does not match" });
        }
        else {
            (async () => {
                const rawResponse = await auth.fetch('resetPassword', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ hash: this.state.hash, newPassword: this.state.newPassword })
                });
                const content = await rawResponse.json();

                if (content.success === true) {
                    this.setState({passwordChanged: true});
                } else {
                    this.setState({ error: true, errorMessage: content.message })
                }

            }
            )();
        }
    }

  render() {

    
    if (this.state.redirectHome) {
        return <Redirect to={{pathname: "/dashboard", }} />;
     }
     if (this.state.redirect404) {
        return <Redirect to={{pathname: "/404", }} />;
     }
  
      return (
        <div className="app flex-row align-items-center">
        {
          (this.state.error && this.state.errorMessage) ? <SweetAlert title="Error!" onConfirm={this.hideAlert}>{this.state.errorMessage}</SweetAlert>
   : <p></p> 
        }
        {
          this.state.passwordChanged ? <SweetAlert title="Success!" onConfirm={this.hideSuccessAlert}>Password successfully changed!</SweetAlert>
   : <p></p> 
        }
          <Container>
            <Row className="justify-content-center">
              <Col md="8">
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      <Form onSubmit={(e) => this.recoverAccount(e)}>
                        <h1>Reset password</h1>
                        <p className="text-muted">Recover your account</p>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                            <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="password" placeholder="New Password" autoComplete="Email" 
                            onChange={(evt) => { this.setState({newPassword: evt.target.value});}}
                          />
                        </InputGroup>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                            <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="password" placeholder="Confirm Password" autoComplete="Email" 
                            onChange={(evt) => { this.setState({confirmPassword: evt.target.value});}}
                          />
                        </InputGroup>
                        <Row>
                          <Col xs="6">
                            <Button type="button" color="primary" className="px-4" onClick={this.recoverAccount}>Recover</Button>
                          </Col>
                          <Col xs="6">
                            <Button type="button" color="primary" onClick={() => {this.setState({redirectHome: true})}} className="px-4 pull-right">Go back</Button>
                          </Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div>
      );
  }
}

export default ResetPassword;
