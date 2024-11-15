import api from '../api';

export const getContest = async (id: number) => {
  try {
    const response = await api.get(`/admin/contest/${id}`);
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};