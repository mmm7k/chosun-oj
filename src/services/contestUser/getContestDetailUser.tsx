import api from '../api';

export const getContestDetailUser = async (id: number) => {
  try {
    const response = await api.get(`/contest/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
