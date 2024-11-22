import api from '../api';

export const getAllSubmission = async (
  page: number,

  problemId: number,
) => {
  try {
    const response = await api.get(
      `/admin/problem/${problemId}/submission?page=${page}&page_size=15`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
