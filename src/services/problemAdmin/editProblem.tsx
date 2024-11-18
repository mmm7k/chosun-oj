import api from '../api';

export const editProblem = async (id: number, payload: any) => {
  try {
    const response = await api.patch(`/admin/problem/${id}`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
