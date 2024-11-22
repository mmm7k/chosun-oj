import api from '../api';

export const getModifyUser = async (id: number) => {
  try {
    const response = await api.get(`/admin/account/user/${id}/modify`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
