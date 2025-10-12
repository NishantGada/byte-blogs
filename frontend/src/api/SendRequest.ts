import axios from 'axios';

// Helper to get JWT token (from localStorage for now)
const getToken = () => {
  return localStorage.getItem('jwtToken') || '';
};

const SendRequest = async (
  path: string,
  data?: any,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
  headers: Record<string, string> = {},
  authRequired: boolean = false
) => {
  const baseUrl = 'http://localhost:3000'; // adjust if using different frontend/backend ports
  path = baseUrl + path;

  if (authRequired) {
    const token = getToken();
    headers = {
      ...headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  } else {
    headers = {
      ...headers,
      'Content-Type': 'application/json',
    };
  }

  switch (method) {
    case 'POST':
      return axios.post(path, data, { headers });
    case 'GET':
      return axios.get(path, { headers });
    case 'PUT':
      return axios.put(path, data, { headers });
    case 'DELETE':
      return axios.delete(path, { headers });
    default:
      throw new Error(`Unsupported method: ${method}`);
  }
};

export default SendRequest;
