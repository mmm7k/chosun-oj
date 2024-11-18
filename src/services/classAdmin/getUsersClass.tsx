import api from '../api';

export const getUsersClass = async (id: number) => {
  try {
    const response = await api.get(`/admin/group/${id}/users?page_size=all`);
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};
