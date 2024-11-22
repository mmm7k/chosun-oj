import api from '../api';

export const postAnnouncement = async (data: any) => {
  try {
    const response = await api.post('/admin/announcement/', data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
