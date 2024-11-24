import api from '../api';

export const getCourseQuestionUser = async (page: number, id: number) => {
  try {
    const response = await api.get(
      `/course/${id}/questions?page=${page}&page_size=15`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
