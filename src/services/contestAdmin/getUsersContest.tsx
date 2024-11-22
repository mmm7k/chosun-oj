import api from '../api';

export const getUsersContest = async (id: number) => {
  try {
    const response = await api.get(`/admin/contest/${id}/user?page_size=all`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
