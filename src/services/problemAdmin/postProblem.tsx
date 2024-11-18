import api from '../api';

export const postProblem = async (data: any) => {
  try {
    const response = await api.post('/admin/problem/', data);
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};
