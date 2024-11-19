import api from '../api';

export const deleteProblemsAssignment = async (id: number, payload: any) => {
  try {
    const response = await api.delete(`/admin/assignment/${id}/problem`, {
      data: payload,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
