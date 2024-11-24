import api from '../api';

export const deleteQuestionAdmin = async (id: number) => {
  try {
    const response = await api.delete(`/admin/question/${id}/`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
