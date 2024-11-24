import api from '../api';

export const postCourseQuestion = async (id: number, payload: any) => {
  try {
    const response = await api.post(`/course/${id}/question/`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
