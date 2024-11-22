import api from '../api';

export const getAllAnnouncement = async (page: number) => {
  try {
    const response = await api.get(`/admin/announcement?page=${page}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
