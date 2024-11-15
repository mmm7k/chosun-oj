import api from '../api';

export const getProblemsContest = async (id: number) => {
  try {
    const response = await api.get(`/admin/contest/${id}/problem`);
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};
