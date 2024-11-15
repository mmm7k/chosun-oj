import api from '../api';

export const deleteProblemsContest = async (id: number, payload: any) => {
  try {
    const response = await api.delete(`/admin/contest/${id}/problem`, {
      data: payload,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
