import api from '../api';

export const getAllSubmissionAssignment = async (
  page: number,
  assignmentId: number,
  problemId: number,
) => {
  try {
    const response = await api.get(
      `/admin/assignment/${assignmentId}/problem/${problemId}/submission?page=${page}&page_size=15`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
