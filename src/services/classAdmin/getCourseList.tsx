import api from '../api';

export const getCourseList = async () => {
  try {
    const response = await api.get(`/admin/courses?page_size=all`);
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};
