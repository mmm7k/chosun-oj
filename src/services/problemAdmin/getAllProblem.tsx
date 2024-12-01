import api from '../api';

export const getAllProblem = async (
  page: number,
  keyword?: string,
  type?: string,
  language?: string,
) => {
  try {
    let queryParams = `page=${page}&page_size=15`;
    if (keyword) queryParams += `&keyword=${encodeURIComponent(keyword)}`;
    if (type) queryParams += `&type=${encodeURIComponent(type)}`;
    if (language) queryParams += `&language=${encodeURIComponent(language)}`;

    const response = await api.get(`/admin/problem?${queryParams}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
