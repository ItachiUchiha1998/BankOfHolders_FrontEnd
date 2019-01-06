import React, {Component} from 'react';
import FloatingLabel from 'floating-label-react'

const floatingStyles = {
    floating: {
        color: '#1e90ff'
    },
    label: {
        width: '100%',
        color: '#828282'
    },
    input: {
        backgroundColor: 'transparent',
        width: "100%",
        borderBottom: '1px solid #ccc',
        color: '#636363'
    },
    focus: {
        borderColor: "#1e90ff",
    }
};

class ThemeFloatingLabel extends Component {
    constructor(props){
        super(props);

        this.inputFocus = this.inputFocus.bind(this);
        this.inputBlur = this.inputBlur.bind(this);

        this.icon = this.props.icon || '';
        this.placeholder = this.props.placeholder || 'placeholder';
        this.type = this.props.type || "text";
        this.required = this.props.required || false;
        this.name = this.props.name || "";

        this.state = {
            focussed: false,
            error: false
        }
    }

    inputFocus(){
        this.setState({focussed: true});
    }
    inputBlur(){
        this.setState({focussed: false});
    }


    render() {
        return (
            <div className="w-100 theme-floating-label">
                <FloatingLabel name={this.name} required={this.props.required} onFocus={this.inputFocus} onBlur={this.inputBlur} placeholder={this.placeholder} onChange={this.props.onChange} styles={floatingStyles} type={this.type} />
                {this.state.focussed?<i className="material-icons floating-icon focussed">{this.icon}</i>:<i className="material-icons floating-icon">{this.icon}</i>}
            </div>
        )
    }
}
export default ThemeFloatingLabel;