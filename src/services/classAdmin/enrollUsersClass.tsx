import api from '../api';

export const enrollUsersClass = async (id: number, payload: any) => {
  try {
    const response = await api.post(`/admin/group/${id}/users/`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
