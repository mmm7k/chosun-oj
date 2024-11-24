import api from '../api';

export const deleteAnswerAdmin = async (id: number) => {
  try {
    const response = await api.delete(`/admin/answer/${id}/`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
