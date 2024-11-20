import api from '../api';

export const deleteClassAnnouncement = async (
  classId: number,
  announcementId: number,
) => {
  try {
    const response = await api.delete(
      `/admin/group/${classId}/announcement/${announcementId}`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
