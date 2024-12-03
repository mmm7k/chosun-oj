import api from '../api';

export const getAllClass = async (
  page: number,
  search?: string,
  year?: string,
  quarter?: string,
) => {
  try {
    let queryParams = `page=${page}&page_size=15`;
    if (search) queryParams += `&search=${encodeURIComponent(search)}`;
    if (year) queryParams += `&year=${encodeURIComponent(year)}`;
    if (quarter) queryParams += `&quarter=${encodeURIComponent(quarter)}`;
    const response = await api.get(`/admin/groups?${queryParams}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
