import api from './api';

export const checkUser = async () => {
  try {
    const response = await api.get('/account/profile/');
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    //   window.location.href = '/';
    return null;
  }
};
