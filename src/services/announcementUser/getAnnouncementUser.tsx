import api from '../api';

export const getAnnouncementUser = async (page: number) => {
  try {
    const response = await api.get(`/announcement?page=${page}&page_size=15`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getTop3AnnouncementUser = async () => {
  try {
    const response = await api.get(`/announcement?page=${1}&page_size=3`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
