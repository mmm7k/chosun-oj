import api from '../api';

export const patchEditAnswer = async (id: number, payload: any) => {
  try {
    const response = await api.patch(`/answer/${id}/`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
