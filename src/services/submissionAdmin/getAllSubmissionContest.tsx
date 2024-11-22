import api from '../api';

export const getAllSubmissionContest = async (
  page: number,
  contestId: number,
  problemId: number,
) => {
  try {
    const response = await api.get(
      `/admin/contest/${contestId}/problem/${problemId}/submission?page=${page}&page_size=15`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
