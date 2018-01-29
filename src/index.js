import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import  thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension";
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import rootReducer from "./rootReducer";
import * as actions from "./actions/auth";
import setAuthorizationHeader from "./utils/setAuthorizationHeader";
import api from './api';

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);
if (localStorage.token) {
    
    const user = {
        id: localStorage.id,
        token: localStorage.token,
    };
    
    api.user.validateToken(user).then((response)=>{
        if(response === "valid"){
            setAuthorizationHeader(user.token);
            store.dispatch(actions.userLoggedIn(user));
        }else{
            localStorage.clear();
            setAuthorizationHeader();
            store.dispatch(actions.userLoggedOut());
        }
    });
}

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <Route component={App}/>
        </Provider>
    </BrowserRouter>
    , document.getElementById('root'));
registerServiceWorker();
