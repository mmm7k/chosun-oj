import api from '../api';

export const getAllSubmission = async (
  page: number,
  problemId: number,
  user?: string,
  status?: string,
) => {
  try {
    let queryParams = `page=${page}&page_size=15`;
    if (user) queryParams += `&user=${encodeURIComponent(user)}`;
    if (status) queryParams += `&status=${encodeURIComponent(status)}`;
    const response = await api.get(
      `/admin/problem/${problemId}/submission?${queryParams}`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
