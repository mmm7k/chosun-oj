import api from '../api';

export const getNonPageAllContest = async () => {
  try {
    const response = await api.get(`/admin/contest?page_size=all`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
