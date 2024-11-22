import api from '../api';

export const getProblemDetailUser = async (problemId: number) => {
  try {
    const response = await api.get(`/problem/${problemId}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
