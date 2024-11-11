import axios from 'axios';

const BASE_URL = 'http://chosuncnl.shop:8000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// 쿠키에서 CSRF 토큰을 가져오는 함수
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  //@ts-ignore
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// 요청 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    const csrftoken = getCookie('csrftoken');
    if (csrftoken) {
      config.headers['X-CSRFToken'] = csrftoken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
