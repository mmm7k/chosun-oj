import api from './api';

// 로그인 요청 함수
export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/account/login/', { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.get('/account/logout/');
    return response.data;
  } catch (error) {
    throw error;
  }
};
