import axios from "axios";

const API = axios.create({
    baseURL: "https://campusfind-hu7x.onrender.com/api"
});

export default API;