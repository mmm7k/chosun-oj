import api from './api';

// 쿠키에서 CSRF 토큰을 가져오는 함수
function getCookie(name: any) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  //@ts-ignore
  if (parts.length === 2) return parts.pop().split(';').shift();
}

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
