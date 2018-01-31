import React from 'react';
import PropTypes from 'prop-types'
import {Button} from 'semantic-ui-react';
import {connect} from 'react-redux';
import * as actions from '../../actions/auth';



const Home = ({logout}) => (
    <Button onClick={() => {logout()}}>logout</Button>
)

export default connect(null, {logout: actions.logout})(Home);