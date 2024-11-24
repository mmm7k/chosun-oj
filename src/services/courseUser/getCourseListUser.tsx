import api from '../api';

export const getCourseListUser = async () => {
  try {
    const response = await api.get('/courses?page_size=all');
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
