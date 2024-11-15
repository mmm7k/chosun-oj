import api from '../api';

export const enrollUsersContest = async (id: number, payload: any) => {
  try {
    const response = await api.post(`/admin/contest/${id}/user/`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
