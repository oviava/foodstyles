import { redirect } from 'react-router';
import { setToken } from './helpers';

export const useAuthApi = () => {
  const login = async (username: string, password: string) => {
    const response = await fetch('http://localhost:3333/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    setToken(data.token);
    return data as { token: string };
  };

  const register = async (username: string, password: string) => {
    const response = await fetch('http://localhost:3333/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    setToken(data.token);
    return data as { token: string };
  };

  const logout = async () => {
    localStorage.removeItem('token');
    redirect('/login');
  };

  return {
    login,
    register,
    logout,
  };
};
