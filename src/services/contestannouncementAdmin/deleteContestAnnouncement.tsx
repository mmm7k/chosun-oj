import api from '../api';

export const deleteContestAnnouncement = async (
  contestId: number,
  announcementId: number,
) => {
  try {
    const response = await api.delete(
      `/admin/contest/${contestId}/announcement/${announcementId}`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
