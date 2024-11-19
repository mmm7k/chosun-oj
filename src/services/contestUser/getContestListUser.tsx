import api from '../api';

export const getContestListUser = async () => {
  try {
    const response = await api.get('/contest/');
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
