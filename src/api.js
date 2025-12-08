// src/api.js
import getApiBaseUrl from "./config";
import axios from "axios";

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

export const fetchCurrencies = () => api.get("/currency");
export const fetchOtherData = () => api.get("/other-endpoint");
// Add more API functions as needed
