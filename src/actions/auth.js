import { USER_LOGGED_IN, USER_LOGGED_OUT } from "../types";
import api from "../api";
import setAuthorizationHeader from '../utils/setAuthorizationHeader';

export const userLoggedIn = user => ({
    type: USER_LOGGED_IN,
    user
});

export const userLoggedOut = () => ({
    type: USER_LOGGED_OUT
  });

export const login = credentials => dispatch =>
api.user.login(credentials).then(user => {
    localStorage.token = user.token;
    localStorage.id    = user.ID;
    setAuthorizationHeader(user.token);
    dispatch(userLoggedIn(user));
});

export const logout = () => dispatch => {
    localStorage.clear();
    setAuthorizationHeader();
    dispatch(userLoggedOut());
  };