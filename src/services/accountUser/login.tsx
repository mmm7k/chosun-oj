import api from '../api';

// 로그아웃 요청 함수
const attemptLogout = async () => {
  try {
    await api.get('/account/logout/');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// 로그인 요청 함수
export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/account/login/', { username, password });
    return response.data;
  } catch (error) {
    // 첫 로그인 시도 실패 시 로그아웃 후 재시도
    await attemptLogout();
    try {
      const retryResponse = await api.post('/account/login/', {
        username,
        password,
      });
      return retryResponse.data;
    } catch (retryError) {
      throw retryError; // 재시도 실패 시 최종 에러 반환
    }
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
