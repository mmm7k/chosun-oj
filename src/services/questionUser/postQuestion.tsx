import api from '../api';

export const postQuestion = async (payload: any) => {
  try {
    const response = await api.post(`/question/`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
