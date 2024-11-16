import api from '../api';

export const getClassAnnouncement = async (
  classId: number,
  announcementId: number,
) => {
  try {
    const response = await api.get(
      `/admin/group/${classId}/announcement/${announcementId}`,
    );
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};
