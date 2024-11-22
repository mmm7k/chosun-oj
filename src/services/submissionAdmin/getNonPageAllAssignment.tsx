import api from '../api';

export const getNonPageAllAssignment = async () => {
  try {
    const response = await api.get(`/admin/assignment?page_size=all`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
