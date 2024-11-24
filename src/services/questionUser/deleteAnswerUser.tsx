import api from '../api';

export const deleteAnswerUser = async (id: number) => {
  try {
    const response = await api.delete(`/answer/${id}/`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
