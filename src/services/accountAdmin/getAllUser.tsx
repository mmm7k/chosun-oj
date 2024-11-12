import api from '../api';

export const getAllUser = async (page: number) => {
  try {
    const response = await api.get(
      `/admin/account/users?page=${page}&page_size=15`,
    );
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};
