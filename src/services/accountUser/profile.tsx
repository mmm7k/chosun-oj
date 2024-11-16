import api from '../api';

export const getMyProfile = async () => {
  try {
    const response = await api.get('/account/profile/');
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getMyInformation = async () => {
  try {
    const response = await api.get('/account/profile/modify');
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const modifyInfo = async (payload: ModifyInfoPayload) => {
  try {
    const response = await api.patch('/account/profile/modify', payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
