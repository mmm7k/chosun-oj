import api from '../api';

export const getAssignmentUser = async (id: number) => {
  try {
    const response = await api.get(`/group/${id}/assignment`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
