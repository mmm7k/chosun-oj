import api from '../api';

export const getContestAnnouncement = async (
  contestId: number,
  announcementId: number,
) => {
  try {
    const response = await api.get(
      `/admin/contest/${contestId}/announcement/${announcementId}`,
    );
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};
