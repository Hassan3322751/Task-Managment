import axios from 'axios';

// Create an instance of Axios
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use environment variable or default to localhost
  // baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api', // Use environment variable or default to localhost
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally, e.g., redirect on 401 status
    if (error.response && error.response.status === 401) {
      alert("Unaouthrized")
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;