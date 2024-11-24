import api from '../api';

export const postAnswer = async (id: number, payload: any) => {
  try {
    const response = await api.post(`/question/${id}/answer/`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
