import api from '../api';

export const deleteClass = async (id: number) => {
  try {
    const response = await api.delete(`/admin/group/${id}/`);
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};