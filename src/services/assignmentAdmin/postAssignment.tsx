import api from '../api';

export const postAssignment = async (payload: any) => {
  try {
    const response = await api.post(`/admin/assignment/`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
