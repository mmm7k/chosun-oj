import api from '../api';

export const getAllSubmissionUser = async (page: number, id: number) => {
  try {
    const response = await api.get(
      `/problem/${id}/submission?page=${page}&page_size=15`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
