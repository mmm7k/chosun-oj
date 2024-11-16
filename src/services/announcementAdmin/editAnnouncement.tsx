import api from '../api';

export const editAnnouncement = async (id: number, payload: any) => {
  try {
    const response = await api.patch(`/admin/announcement/${id}/`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
