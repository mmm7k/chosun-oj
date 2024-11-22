import api from '../api';

export const postReSubmitAssignment = async (
  assignmentId: number,
  problemId: number,
  sumissionId: string,
) => {
  try {
    const response = await api.post(
      `/admin/assignment/${assignmentId}/problem/${problemId}/submission/${sumissionId}/resubmit`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
