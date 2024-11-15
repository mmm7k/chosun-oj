import api from '../api';

export const editContest = async (id: number, payload: any) => {
  try {
    const response = await api.patch(`/admin/contest/${id}`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
