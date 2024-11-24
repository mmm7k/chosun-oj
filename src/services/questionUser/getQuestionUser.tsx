import api from '../api';

export const getQuestionUser = async (page: number) => {
  try {
    const response = await api.get(`/questions?page=${page}&page_size=15`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
