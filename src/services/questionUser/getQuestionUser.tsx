import api from '../api';

export const getQuestionUser = async (page: number, search?: string) => {
  try {
    let queryParams = `page=${page}&page_size=15`;
    if (search) queryParams += `&search=${encodeURIComponent(search)}`;
    const response = await api.get(`/questions?${queryParams}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
