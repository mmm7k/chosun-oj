import api from '../api';

export const enrollProblemsContest = async (id: number, payload: any) => {
  try {
    const response = await api.post(`/admin/contest/${id}/problem`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
