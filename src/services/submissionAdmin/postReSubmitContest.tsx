import api from '../api';

export const postReSubmitContest = async (
  contestId: number,
  problemId: number,
  sumissionId: string,
) => {
  try {
    const response = await api.post(
      `/admin/contest/${contestId}/problem/${problemId}/submission/${sumissionId}/resubmit`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
