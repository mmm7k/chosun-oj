import api from '../api';

export const postContestAnnouncement = async (id: number, data: any) => {
  try {
    const response = await api.post(`/admin/contest/${id}/announcement/`, data);
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};
