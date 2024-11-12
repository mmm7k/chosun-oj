import api from '../api';

export const editUsers = async (id: number, payload: any) => {
  try {
    const response = await api.patch(
      `/admin/account/user/${id}/modify`,
      payload,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
