import api from '../api';

export const postClassAnnouncement = async (id: number, data: any) => {
  try {
    const response = await api.post(`/admin/group/${id}/announcement/`, data);
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};
