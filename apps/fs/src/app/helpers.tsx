import { redirect } from 'react-router';

export const getToken = () => {
  return 'test';
  return localStorage.getItem('token');
};

export const setToken = (token: string) => {
  return localStorage.setItem('token', token);
};

export const wrapedFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) => {
  const token = getToken();
  if (!token) {
    redirect('/login');
    return;
  }
  const options = init || {};
  if (token) {
    options.headers = {
      ...options.headers,
      'x-access-token': token,
    };
  }
  const response = await fetch(input, options);
  if (response.status === 401) {
    redirect('/login');
  }
  return response;
};
