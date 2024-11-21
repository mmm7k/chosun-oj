import api from '../api';

export const getAllAssignment = async (page: number) => {
  try {
    const response = await api.get(
      `/admin/assignment?page=${page}&page_size=15`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
