import api from '../api';

export const getCourseQuestionUser = async (
  page: number,
  id: number,
  search?: string,
) => {
  try {
    let queryParams = `page=${page}&page_size=15`;
    if (search) queryParams += `&search=${encodeURIComponent(search)}`;
    const response = await api.get(`/course/${id}/questions?${queryParams}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
