import api from '../api';

export const getAllCourse = async (page: number) => {
  try {
    const response = await api.get(`/admin/courses?page=${page}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
