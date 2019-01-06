import React, {Component} from 'react';
import {Redirect} from 'react-router';
import {Col} from 'reactstrap';
import ThemeButton from './ThemeButton';


class DashboardBanner extends Component {
    constructor(props) {
        super(props);

        this.textMain = this.props.textMain;
        this.textSmall = this.props.textSmall;
        this.button1Action = this.props.button1Action;
        this.button2Action = this.props.button2Action;

        this.state = {};
    }

    render() {
        return (
            <Col xs="12" md="12" className="dashboard-banner">
                <div className="p-2-0">
                    <Col xs="12" md="8" className="no-p v-align-bottom">
                        <span className="text-main">
                            {this.textMain}
                        </span>
                        <br/>
                        <span className="text-small">
                            {this.textSmall}
                        </span>
                    </Col>
                    <Col xs="12" md="4" className="display-inb text-right no-p">
                        {
                            this.button1Action ? <ThemeButton onClick={this.props.button1Action} buttonText="Add Fund"
                                                              buttonSize='medium'/> : null
                        }
                        {
                            this.button2Action ?
                                <ThemeButton onClick={this.props.button2Action} buttonText="Borrow/Lend"
                                             buttonSize='medium'/> : null
                        }
                    </Col>
                </div>
            </Col>

        )
    }
}

export default DashboardBanner;