import React from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import LoginPage from "./components/pages/Login";

import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import UserRoute from './components/routes/UserRoute';

const App = ({location, isAuthenticated}) => (
    <div> 
        {
            isAuthenticated ? 
            <UserRoute location={location} path="/" exact component={Home}/> : <Route path="/" exact component={LoginPage}/>
        }

        <UserRoute location={location} path="/Profile" exact component={Profile}/>
       
    </div>
);

App.propTypes={
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    }).isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
}


function mapStateToProps(state) {
    return {
        isAuthenticated: !!state.user.token
    };
}

  export default connect(mapStateToProps)(App);