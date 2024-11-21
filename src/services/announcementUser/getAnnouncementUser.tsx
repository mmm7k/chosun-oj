import api from '../api';

export const getAnnouncementUser = async (page: number) => {
  try {
    const response = await api.get(`/announcement?page=${page}&page_size=15`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
