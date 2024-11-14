import api from '../api';

export const getClass = async (id: number) => {
  try {
    const response = await api.get(`/admin/group/${id}/`);
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};
