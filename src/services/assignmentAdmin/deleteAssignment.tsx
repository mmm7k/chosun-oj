import api from '../api';

export const deleteAssignment = async (id: number) => {
  try {
    const response = await api.delete(`/admin/assignment/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
