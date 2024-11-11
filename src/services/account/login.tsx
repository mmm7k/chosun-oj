import api from './api';

// 쿠키에서 CSRF 토큰을 가져오는 함수
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  //@ts-ignore
  if (parts.length === 2) return parts.pop().split(';').shift();
}

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

    // 로그인 후 쿠키에서 CSRF 토큰 가져와 Axios 기본 헤더에 설정
    const csrftoken = getCookie('csrftoken');
    if (csrftoken) {
      api.defaults.headers.common['X-CSRFToken'] = csrftoken;
    }

    return response.data;
  } catch (error) {
    // 첫 로그인 시도 실패 시 로그아웃 후 재시도
    await attemptLogout();
    try {
      const retryResponse = await api.post('/account/login/', {
        username,
        password,
      });
      const csrftoken = getCookie('csrftoken');
      if (csrftoken) {
        api.defaults.headers.common['X-CSRFToken'] = csrftoken;
      }
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
