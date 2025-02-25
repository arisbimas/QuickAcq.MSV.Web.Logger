import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        ContentType: 'application/json'
    }
})

export default api