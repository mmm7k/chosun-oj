import api from '../api';

export const editContestAnnouncement = async (
  contestId: number,
  announcementId: number,
  payload: any,
) => {
  try {
    const response = await api.patch(
      `/admin/contest/${contestId}/announcement/${announcementId}`,
      payload,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
