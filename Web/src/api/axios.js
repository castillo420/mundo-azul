import axios from "axios";

const instance = axios.create({
  baseURL: "https://mundo-azul-eszg.onrender.com/api",
  withCredentials: true, 
});

export default instance;
