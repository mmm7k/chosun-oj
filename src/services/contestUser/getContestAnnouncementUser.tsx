import api from '../api';

export const getContestAnnouncementUser = async (id: number) => {
  try {
    const response = await api.get(`/contest/${id}/announcement`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
