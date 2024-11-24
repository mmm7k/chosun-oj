import api from '../api';

export const deleteQuestionUser = async (id: number) => {
  try {
    const response = await api.delete(`/question/${id}/`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
