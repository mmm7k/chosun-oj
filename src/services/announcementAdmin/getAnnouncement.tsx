import api from '../api';

export const getAnnouncement = async (id: number) => {
  try {
    const response = await api.get(`/admin/announcement/${id}/`);
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};