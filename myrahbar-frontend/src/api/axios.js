import axios from "axios";

// Localhost ka path set karein
axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;
