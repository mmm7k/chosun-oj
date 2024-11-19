import api from '../api';

export const getContestProblemListUser = async (page: number, id: number) => {
  try {
    const response = await api.get(
      `/contest/${id}/problem?${page}&page_size=15`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
