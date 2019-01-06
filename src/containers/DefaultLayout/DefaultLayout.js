import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Container} from 'reactstrap';
import {
    AppBreadcrumb,
    AppHeader,
    AppSidebar,
    AppSidebarFooter,
    AppSidebarForm,
    AppSidebarHeader,
    AppSidebarMinimizer,
    AppSidebarNav,
} from '@coreui/react';

import navigation from '../../_nav';

import routes from '../../routes';
import DefaultHeader from './DefaultHeader';
import AuthService from '../../AuthService';

const auth = new AuthService();

class DefaultLayout extends Component {

    constructor(props) {
        super(props);

        this.scrollFunction = this.scrollFunction.bind(this);

        this.state = {
            redirectLogin: false,
            scroll: false
        }
    }

    componentDidMount() {
        if (!auth.loggedIn()) {
            this.setState({redirectLogin: true})
        }
        document.title = "BoH";
    }

    scrollFunction(){
        window.onscroll = function (e) {
            if(document.getElementById('appHeader')){
                if(window.pageYOffset > 0){
                    document.getElementById('appHeader').classList.add('shadow');
                }else{
                    document.getElementById('appHeader').classList.remove('shadow');
                }
            }
        };
    }

    render() {

        if (this.state.redirectLogin || !auth.loggedIn()) {
            return <Redirect to={{pathname: "/login",}}/>;
        }
        this.scrollFunction();
        return (
            <div className="app">
                <AppHeader id="appHeader" className={(this.state.scroll?'shadow':"")} fixed>
                    <DefaultHeader location={this.props.location} />
                </AppHeader>
                <div className="app-body">
                    <main className="main">
                        <Container className="no-pm" fluid>
                            <Switch>
                                {routes.map((route, idx) => {
                                        return route.component ? (
                                                <Route key={idx} path={route.path} exact={route.exact} name={route.name}
                                                       render={props => (
                                                           <route.component {...props} />
                                                       )}/>)
                                            : (null);
                                    },
                                )}
                                <Redirect from="/" to="/dashboard"/>
                            </Switch>
                        </Container>
                    </main>
                    <AppSidebar fixed display="xs">
                        <AppSidebarHeader/>
                        <AppSidebarForm/>
                        <AppSidebarNav navConfig={navigation} {...this.props} />
                        <AppSidebarFooter/>
                        <AppSidebarMinimizer/>
                    </AppSidebar>
                </div>
            </div>
        );
    }
}

export default DefaultLayout;
