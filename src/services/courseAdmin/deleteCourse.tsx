import api from '../api';

export const deleteCourse = async (id: number) => {
  try {
    const response = await api.delete(`/admin/course/${id}/`);
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};
