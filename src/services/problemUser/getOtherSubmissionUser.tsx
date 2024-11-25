import api from '../api';

export const getOtherSubmissionUser = async (page: number, id: number) => {
  try {
    const response = await api.get(
      `/problem/${id}/submission/other?page=${page}&page_size=5`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
