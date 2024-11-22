import api from '../api';

export const postAssignmentSubmission = async (
  classId: number,
  assignmentId: number,
  problemId: number,
  data: any,
) => {
  try {
    const response = await api.post(
      `/group/${classId}/assignment/${assignmentId}/problem/${problemId}/submit`,
      data,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
