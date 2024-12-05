import api from '../api';

export const getScoreBoardContest = async (id: number) => {
  try {
    const response = await api.get(`/admin/contest/${id}/result`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
