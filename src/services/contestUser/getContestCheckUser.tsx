import api from '../api';

export const getContestCheckUser = async (id: number) => {
  try {
    const response = await api.get(`/contest/${id}/check`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
