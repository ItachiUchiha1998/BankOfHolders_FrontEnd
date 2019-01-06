import {Component} from "react";

class KickOffScript extends Component {
    constructor(props) {
        super(props);

        this.triggerSignUp = this.triggerSignUp.bind(this);

        this.state = {
            scriptLoaded: false
        }
    }

    triggerSignUp(){
        console.log(document.getElementById('full_kickoffpage_frame').contentWindow.document.getElementById('email'));
    }

    componentDidMount(){
        if(!this.state.scriptLoaded){
            window.KOL_Embed_Page.makeFrame({
                container_id: 'full_kickoffpage',
                height: '100%',
                width: '100%',
                page_id: 239958
            });
            this.setState({
                scriptLoaded: true
            })
            this.triggerSignUp();
        }
    }

    render() {
        return null;
    }
}
export default KickOffScript;