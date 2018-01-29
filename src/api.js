import axios from "axios";

export default {
    user: {
        login: credentials =>
            axios.post('/auth', { credentials }).then(res=> res.data)
        ,
        validateToken: user =>
            axios.post('/ValidateToken', {user}).then(res=> res.data)
    }
};