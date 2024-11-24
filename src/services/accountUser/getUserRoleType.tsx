import api from '../api';

export const getUserRoleType = async () => {
  try {
    const response = await api.get(`/account/user/role_type`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
