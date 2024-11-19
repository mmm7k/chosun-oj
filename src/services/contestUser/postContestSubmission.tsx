import api from '../api';

export const getContestProblemDetailUser = async (
  contestId: number,
  problemId: number,
) => {
  try {
    const response = await api.post(
      `/contest/${contestId}/problem/${problemId}/submit`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
