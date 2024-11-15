import api from '../api';

export const getAllProblem = async (page: number) => {
  try {
    const response = await api.get(`/admin/problem?page=${page}`);
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};
