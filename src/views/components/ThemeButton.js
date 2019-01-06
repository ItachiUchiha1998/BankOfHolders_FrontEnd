import React, {Component} from 'react'

class ThemeButton extends Component{
    constructor(props){
        super(props);
        this.buttonText = this.props.buttonText || "";
        this.buttonSize = this.props.buttonSize || "medium";
        this.buttonType = this.props.buttonType || "button";
        this.disabled = this.props.disabled || false;
        this.className = this.props.className || "";
        this.theme = this.props.theme || "primary";

        this.state = {
            btnClass: "btn theme-btn " + this.buttonSize +" "+ this.theme + " " + this.className
        }
    }

    render(){
        return <button disabled={this.disabled} type={this.buttonType} onClick={this.props.onClick} className={this.state.btnClass}>{this.buttonText}</button>
    }
}
export default ThemeButton;