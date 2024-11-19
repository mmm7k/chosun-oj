import api from '../api';

export const editAssignment = async (id: number, payload: any) => {
  try {
    const response = await api.patch(`/admin/assignment/${id}`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
