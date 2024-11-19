import api from '../api';

export const getContestProblemDetailUser = async (
  contestId: number,
  problemId: number,
) => {
  try {
    const response = await api.get(
      `/contest/${contestId}/problem/${problemId}`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
