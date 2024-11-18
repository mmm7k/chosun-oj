import api from '../api';

export const getProblem = async (id: number) => {
  try {
    const response = await api.get(`/admin/problem/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
