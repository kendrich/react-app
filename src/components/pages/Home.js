import React, {Component} from 'react'
import {connect} from 'react-redux'
import Map from '../forms/Map';
import * as actions from '../../actions/auth';

class Home extends Component {

    render() {
        return (
            <div className="pages-div">
                <Map/>
            </div>
        )
    }
}

export default connect(null, {logout: actions.logout})(Home);