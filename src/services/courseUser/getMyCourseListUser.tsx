import api from '../api';

export const getMyCourseListUser = async () => {
  try {
    const response = await api.get('/course/mycourse?page_size=all');
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
