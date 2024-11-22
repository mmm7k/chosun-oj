import api from '../api';

export const getUser = async (id: number) => {
  try {
    const response = await api.get(`/admin/account/user/${id}/`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
