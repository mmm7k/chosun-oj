import api from '../api';

export const getCourse = async (id: number) => {
  try {
    const response = await api.get(`/admin/course/${id}/`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
