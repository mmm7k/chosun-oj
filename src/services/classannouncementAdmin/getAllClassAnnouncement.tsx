import api from '../api';

export const getAllClassAnnouncement = async (id: number) => {
  try {
    const response = await api.get(
      `/admin/group/${id}/announcement?page_size=all`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
