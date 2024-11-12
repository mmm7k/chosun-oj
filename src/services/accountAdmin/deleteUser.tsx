import api from '../api';

export const deleteUser = async (id: number) => {
  try {
    const response = await api.delete(`/admin/account/user/${id}/`);
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};
