import api from '../api';

export const getProblemsAssignment = async (id: number) => {
  try {
    const response = await api.get(
      `/admin/assignment/${id}/problem?page_size=all`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
