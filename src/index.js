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
import { userLoggedIn } from "./actions/auth";
import setAuthorizationHeader from "./utils/setAuthorizationHeader";
import api from './api';

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);
if (localStorage.token) {
    console.log(api.user.validateToken(localStorage.token))
    const user = {
      token: localStorage.token,
    };
    setAuthorizationHeader(localStorage.token);
    store.dispatch(userLoggedIn(user));
}

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <Route component={App}/>
        </Provider>
    </BrowserRouter>
    , document.getElementById('root'));
registerServiceWorker();
