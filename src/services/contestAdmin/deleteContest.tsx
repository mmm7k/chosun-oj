import api from '../api';

export const deleteContest = async (id: number) => {
  try {
    const response = await api.delete(`/admin/contest/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
