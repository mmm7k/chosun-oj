import api from '../api';

export const editClassAnnouncement = async (
  classId: number,
  announcementId: number,
  payload: any,
) => {
  try {
    const response = await api.patch(
      `/admin/group/${classId}/announcement/${announcementId}`,
      payload,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
