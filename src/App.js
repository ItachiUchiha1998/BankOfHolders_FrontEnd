import React, {Component} from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';

// Styles
// CoreUI Icons Set
import '@coreui/icons/css/coreui-icons.min.css';
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import './scss/style.css'

// Containers
import {DefaultLayout} from './containers';
// Pages
import {Login, Page404, Page500, Register, ForgotPassword, ResetPassword, ActivateAccount, ThankYou} from './views/Pages';
// Custom Css
import './App.css';

// import { renderRoutes } from 'react-router-config';

class App extends Component {
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route exact path="/login" name="Login Page" component={Login}/>
                    <Route exact path="/register" name="Register Page" component={Register}/>
                    <Route exact path="/register/:kid" name="Register Page" component={Register}/>
                    <Route exact path="/thankyou" name="Thankyou Page" component={ThankYou}/>
                    <Route exact path="/forgotPassword" name="Forgot Password Page" component={ForgotPassword}/>
                    <Route path="/reset/:hash" component={ResetPassword}/>
                    <Route path="/activateAccount/:code" component={ActivateAccount}/>
                    <Route exact path="/404" name="Page 404" component={Page404}/>
                    <Route exact path="/500" name="Page 500" component={Page500}/>
                    <Route path="/" name="Home" component={DefaultLayout}/>
                </Switch>
            </HashRouter>
        );
    }
}

export default App;
