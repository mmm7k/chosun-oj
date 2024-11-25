import api from '../api';

export const getAllUser = async (page: number, user?: string) => {
  try {
    let queryParams = `page=${page}&page_size=15`;
    if (user) queryParams += `&user=${encodeURIComponent(user)}`;
    const response = await api.get(`/admin/account/users?${queryParams}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
