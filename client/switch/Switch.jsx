import React from 'react';
import ReactDOM from 'react-dom';
import { getStatus, setStatus } from './api.jsx';

export default class Switch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            on: false
        }
    }

    componentDidMount() {
        setTimeout((() => {
            getStatus(((data) => {
                console.log("get /api/led", data);
                this.setState({on: data.status});
            }).bind(this));
        }).bind(this));
    }

    __switch() {
        let curr_state = this.state.on;
        this.setState({
            on: !curr_state
        });
        setTimeout((() => {
            setStatus(this.state.on, ((data) => {
                console.log("set /api/led", data);
                this.setState({on: data.status});
            }).bind(this));
        }).bind(this));
    }

    render() {
        return (
            <div className="onoffswitch">
                <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" checked={this.state.on} onChange={() => {}}/>
                <label className="onoffswitch-label" htmlFor="myonoffswitch" onClick={this.__switch.bind(this)}></label>
            </div>
        );
    }
}
