import api from '../api';

export const postCourse = async (data: any) => {
  try {
    const response = await api.post('/admin/course/', data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
