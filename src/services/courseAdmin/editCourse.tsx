import api from '../api';

export const editCourse = async (id: number, payload: any) => {
  try {
    const response = await api.patch(`/admin/course/${id}/`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};