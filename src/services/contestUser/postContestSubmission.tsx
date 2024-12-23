import api from '../api';

export const postContestSubmission = async (
  contestId: number,
  problemId: number,
  data: any,
) => {
  try {
    const response = await api.post(
      `/contest/${contestId}/problem/${problemId}/submit`,
      data,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
