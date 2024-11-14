import api from '../api';

export const enrollClass = async (data: any) => {
  try {
    const response = await api.post('/admin/group/', data);
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};
