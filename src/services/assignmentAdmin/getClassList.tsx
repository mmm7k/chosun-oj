import api from '../api';

export const getClassList = async () => {
  try {
    const response = await api.get(`/admin/groups?page_size=all`);
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};
