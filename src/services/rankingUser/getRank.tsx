import api from '../api';

export const getRank = async () => {
  try {
    const response = await api.get('/user/rank');
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
