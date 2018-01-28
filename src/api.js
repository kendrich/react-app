import axios from "axios";

export default {
    user: {
        login: credentials =>
            axios.post('/auth', { credentials }).then(res=> res.data)
        ,
        validateToken: token =>
            axios.post('/ValidateToken', {token}).then(res=> res.data)
    }
};