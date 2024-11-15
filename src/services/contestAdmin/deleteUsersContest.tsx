import api from '../api';

export const deleteUsersContest = async (id: number, payload: any) => {
  try {
    const response = await api.delete(`/admin/contest/${id}/user/`, {
      data: payload,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
