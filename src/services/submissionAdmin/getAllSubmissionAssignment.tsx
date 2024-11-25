import api from '../api';

export const getAllSubmissionAssignment = async (
  page: number,
  assignmentId: number,
  problemId: number,
  user?: string,
  status?: string,
) => {
  try {
    let queryParams = `page=${page}&page_size=15`;
    if (user) queryParams += `&user=${encodeURIComponent(user)}`;
    if (status) queryParams += `&status=${encodeURIComponent(status)}`;

    const response = await api.get(
      `/admin/assignment/${assignmentId}/problem/${problemId}/submission?${queryParams}`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
