import api from '../api';

export const getAllClass = async (page: number) => {
  try {
    const response = await api.get(`/admin/groups?page=${page}`);
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};
