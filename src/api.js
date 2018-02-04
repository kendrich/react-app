import axios from "axios";

export default {
    user: {
        login: credentials =>
            axios.post('/auth', { credentials }).then(res=> res.data),
        
        validateToken: user =>
            axios.post('/ValidateToken', {user}).then(res=> res.data)
    },

    admin: {
        cars: () => 
            axios.post('/Cars').then(res=> res.data),
    },

    gps: {
        current: () =>
            axios.post('/CurrentLocation').then(res=>res.data)
    }
};