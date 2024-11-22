import api from '../api';

export const getAllProblem = async (page: number) => {
  try {
    const response = await api.get(`/admin/problem?page=${page}&page_size=15`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
