import api from '../api';

export const deleteProblem = async (id: number) => {
  try {
    const response = await api.delete(`/admin/problem/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
