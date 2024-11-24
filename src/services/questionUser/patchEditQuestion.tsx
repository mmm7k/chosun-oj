import api from '../api';

export const patchEditQuestion = async (id: number, payload: any) => {
  try {
    const response = await api.patch(`/admin/question/${id}/`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
