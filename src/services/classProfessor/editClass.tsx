import api from '../api';

export const editClass = async (id: number, payload: any) => {
  try {
    const response = await api.patch(`/admin/group/${id}/`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
