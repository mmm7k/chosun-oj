import api from '../api';

export const getAssignment = async (id: number) => {
  try {
    const response = await api.get(`/admin/assignment/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
