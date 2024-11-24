import api from '../api';

export const getAnswerUser = async (id: number) => {
  try {
    const response = await api.get(`/question/${id}/answers?page_size=all`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
