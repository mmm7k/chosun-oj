import api from '../api';

export const patchEditQuestionUser = async (id: number, payload: any) => {
  try {
    const response = await api.patch(`/question/${id}/`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
