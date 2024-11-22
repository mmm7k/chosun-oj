import api from '../api';

export const getAssignmentAllSubmission = async (
  page: number,
  classId: number,
  assignmentId: number,
  problemId: number,
) => {
  try {
    const response = await api.get(
      `/group/${classId}/assignment/${assignmentId}/problem/${problemId}/submission?page=${page}&page_size=15`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
