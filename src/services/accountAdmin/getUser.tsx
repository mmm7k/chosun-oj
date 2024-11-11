import api from '../api';

export const getAllUser = async () => {
  try {
    const response = await api.get('/admin/account/users');
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    return error;
  }
};
