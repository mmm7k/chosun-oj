import api from '../api';

export const getAllAnnouncement = async (page: number) => {
  try {
    const response = await api.get(`/admin/announcements?page=${page}`);
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};