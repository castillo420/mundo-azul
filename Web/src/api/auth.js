import axios from "./axios";

export const registerRequest = (name) => axios.post("/register", name);

export const loginRequest = (name) => axios.post("/auth/login", name);

export const verifyTokenRequest = () => axios.get("/auth/verify");
