import api from '../api';

export const getAssignmentProblemDetailUser = async (
  classId: number,
  assignmentId: number,
  problemId: number,
) => {
  try {
    const response = await api.get(
      `/group/${classId}/assignment/${assignmentId}/problem/${problemId}`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
