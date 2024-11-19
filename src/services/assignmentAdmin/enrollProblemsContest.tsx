import api from '../api';

export const enrollProblemsAssignment = async (id: number, payload: any) => {
  try {
    const response = await api.post(`/admin/assignment/${id}/problem`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
