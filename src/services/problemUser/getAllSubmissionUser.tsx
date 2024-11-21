import api from '../api';

export const getAllSubmission = async (id: number, page: number) => {
  try {
    const response = await api.get(
      `/problem/${id}/submission?page=${page}&page_size=15`,
    );
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};
