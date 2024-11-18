import api from '../api';

export const deleteUsersClass = async (id: number, payload: any) => {
  try {
    const response = await api.delete(`/admin/group/${id}/users/`, {
      data: payload,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
