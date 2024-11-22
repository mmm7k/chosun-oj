import api from '../api';

export const getProblemsContest = async (id: number) => {
  try {
    const response = await api.get(
      `/admin/contest/${id}/problem?page_size=all`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
