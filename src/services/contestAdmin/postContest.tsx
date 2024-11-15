import api from '../api';

export const postContest = async (payload: any) => {
  try {
    const response = await api.post(`/admin/contest/`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
