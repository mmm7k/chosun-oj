import api from '../api';

export const postContestJoinUser = async (id: number) => {
  try {
    const response = await api.post(`/contest/${id}/join`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
