import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HOST_IP = 'IP_ADDRESS'; // Replace with the server's IP address

export const API_URL = `http://${HOST_IP}:3000`;
export const IMAGE_URL_PREFIX = API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('userToken');
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    console.log('Token in Storage:', token ? 'HAS TOKEN' : 'NO TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

export default api;
