import api from '../api';

export const getAssignmentDetailUser = async (
  classId: number,
  assignmentId: number,
) => {
  try {
    const response = await api.get(
      `/group/${classId}/assignment/${assignmentId}`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
