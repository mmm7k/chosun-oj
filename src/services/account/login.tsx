import api from './api';

// 쿠키에서 csrftoken과 sessionid를 가져와서 axios 요청 헤더에 설정하는 함수
const setTokens = () => {
  const csrftoken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrftoken'))
    ?.split('=')[1];

  const sessionid = document.cookie
    .split('; ')
    .find((row) => row.startsWith('sessionid'))
    ?.split('=')[1];

  // 인터셉터를 사용하여 모든 요청에 대해 Cookie 헤더 설정
  api.interceptors.request.use((config) => {
    if (csrftoken) {
      // GET 요청의 경우 csrftoken만 포함
      if (config.method === 'get') {
        config.headers['Cookie'] = `csrftoken=${csrftoken}`;
      }
      // POST 요청의 경우 csrftoken과 sessionid 포함
      else if (config.method === 'post' && sessionid) {
        config.headers['Cookie'] =
          `csrftoken=${csrftoken}; sessionid=${sessionid}`;
      }
    }
    return config;
  });
};

// 로그인 요청 함수
export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/account/login/', { username, password });

    // setTokens();

    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};
