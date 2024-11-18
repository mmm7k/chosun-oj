import api from '../api';

export const getAllContestAnnouncement = async (id: number) => {
  try {
    const response = await api.get(
      `/admin/contest/${id}/announcement?page_size=all`,
    );
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};