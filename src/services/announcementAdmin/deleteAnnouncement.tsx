import api from '../api';

export const deleteAnnouncement = async (id: number) => {
  try {
    const response = await api.delete(`/admin/announcement/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
