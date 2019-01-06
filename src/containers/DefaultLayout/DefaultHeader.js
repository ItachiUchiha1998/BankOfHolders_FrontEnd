import React, {Component} from 'react';
import {DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink} from 'reactstrap';
import PropTypes from 'prop-types';

import {AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler} from '@coreui/react';
import logo from '../../assets/logo.png';
import {Redirect} from 'react-router';
import AuthService from '../../AuthService';


const auth = new AuthService();
const propTypes = {
    children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);

        this.location = this.props.location;

        this.state = {
            redirectLogin: false,
            user: auth.getProfile()
        };
    }

    logout() {
        auth.logout();
        this.setState({redirectLogin: true})
    }

    render() {
        if (this.state.redirectLogin) {
            return <Redirect to={{pathname: "/login"}}/>;
        }

        // eslint-disable-next-line
        const {children, ...attributes} = this.props;

        return (
            <React.Fragment>
                <AppSidebarToggler className="d-md-none" display="md" mobile/>
                <AppNavbarBrand className="hidden-xs"
                    full={{src: logo, width: '70%', height: 'auto', alt: 'BoH'}}/>
                <Nav className="d-sm-down-none height-100 border-0" navbar>
                    <NavItem className="dashboard" active={this.props.location.pathname === '/dashboard'}>
                        <NavLink href="#/dashboard">
                            <div className="theme-text-h5">
                                <div>
                                    <i/> <span className="hidden-sm nav-item-text">Dashboard</span>
                                </div>
                            </div>
                        </NavLink>
                        <span className="tab-indicator"></span>
                    </NavItem>
                    <NavItem className="bornlend" active={this.props.location.pathname === '/borrow-len'}>
                        <NavLink href="#/borrow-len">
                            <div className="theme-text-h5">
                                <div>
                                    <i/> <span className="hidden-sm nav-item-text">Borrow/Lend</span>
                                </div>
                            </div>
                        </NavLink>
                        <span className="tab-indicator"></span>
                    </NavItem>
                    <NavItem className="wallet" active={this.props.location.pathname === '/wallet'}>
                        <NavLink href="#/wallet">
                            <div className="theme-text-h5 ">
                                <div>
                                    <i/> <span className="hidden-sm nav-item-text">Wallet</span>
                                </div>
                            </div>
                        </NavLink>
                        <span className="tab-indicator"></span>
                    </NavItem>
                    <NavItem className="requests" active={this.props.location.pathname === '/requests'}>
                        <NavLink href="#/requests">
                            <div className="theme-text-h5">
                                <div>
                                    <i/> <span className="hidden-sm nav-item-text">Open Orders</span>
                                </div>
                            </div>
                        </NavLink>
                        <span className="tab-indicator"></span>
                    </NavItem>
                    <NavItem className="agreement" active={this.props.location.pathname === '/agreements'}>
                        <NavLink href="#/agreements">
                            <div className="theme-text-h5">
                                <div>
                                    <i/> <span className="hidden-sm nav-item-text">Filled Orders</span>
                                </div>
                            </div>
                        </NavLink>
                        <span className="tab-indicator"></span>
                    </NavItem>
                </Nav>
                <Nav className="ml-auto" navbar>
                    {
                        this.state.user.username != "" && <span className="mr-1">Welcome {this.state.user.username}</span>
                    }
                    <a className="mr-4 logout-link b-l-1" onClick={this.logout}>Logout</a>
                </Nav>

            </React.Fragment>
        );
    }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
