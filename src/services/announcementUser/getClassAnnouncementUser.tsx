import api from '../api';

export const getClassAnnouncementUser = async (page: number, id: number) => {
  try {
    const response = await api.get(
      `/group/${id}/announcement?page=${page}&page_size=15`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
