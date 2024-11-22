import api from '../api';

export const getAssignmentProblemListUser = async (
  page: number,
  classId: number,
  assignmentId: number,
) => {
  try {
    const response = await api.get(
      `/group/${classId}/assignment/${assignmentId}/problem?page=${page}&page_size=15`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
