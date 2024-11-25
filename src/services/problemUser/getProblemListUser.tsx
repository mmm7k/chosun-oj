import api from '../api';

export const getProblemListUser = async (
  page: number,
  category?: string,
  solved?: string,
  level?: string,
  search?: string,
) => {
  try {
    let queryParams = `page=${page}&page_size=15`;

    if (category) queryParams += `&category=${encodeURIComponent(category)}`;
    if (solved) queryParams += `&solved=${encodeURIComponent(solved)}`;
    if (level) queryParams += `&level=${encodeURIComponent(level)}`;
    if (search) queryParams += `&search=${encodeURIComponent(search)}`;
    const response = await api.get(`/problem?${queryParams}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
