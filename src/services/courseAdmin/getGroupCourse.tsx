import api from '../api';

export const getGroupCourse = async (id: number) => {
  try {
    const response = await api.get(`/admin/course/${id}/groups`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
