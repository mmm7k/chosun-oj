import api from '../api';

export const postSubmitProblem = async (id: number, data: any) => {
  try {
    const response = await api.post(`/problem/${id}/submit`, data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
