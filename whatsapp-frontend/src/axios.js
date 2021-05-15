import axios from "axios";

const development = "http://localhost:5000";
const production = "https://mern-whastapp.herokuapp.com/";

const instance = axios.create({
  baseURL: process.env.NODE_ENV ? production : development,
});

export default instance;
