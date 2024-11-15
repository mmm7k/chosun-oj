import api from '../api';

export const getUsersContest = async (id: number) => {
  try {
    const response = await api.get(`/admin/contest/${id}/user/`);
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};
