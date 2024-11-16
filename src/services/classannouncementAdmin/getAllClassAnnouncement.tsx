import api from '../api';

export const getAllClassAnnouncement = async (id: number) => {
  try {
    const response = await api.get(
      `/admin/group/${id}/announcements?page_size=all`,
    );
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};
