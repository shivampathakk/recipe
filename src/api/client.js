import axios from 'axios';

export const API_URL = 'http://10.0.2.2:3000'; // change to your IP for device

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
