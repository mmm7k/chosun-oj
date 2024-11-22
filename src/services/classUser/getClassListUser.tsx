import api from '../api';

export const getClassListUser = async () => {
  try {
    const response = await api.get('/groups?page_size=all');
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
