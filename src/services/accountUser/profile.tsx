import api from '../api';

export const getMyProfile = async () => {
  try {
    const response = await api.get('/account/profile/');
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};

export const getMyInformation = async () => {
  try {
    const response = await api.get('/account/profile/modify');
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    throw error;
  }
};

export const modifyInfo = async (payload: ModifyInfoPayload) => {
  try {
    const response = await api.patch('/account/profile/modify', payload);
    alert('정보가 수정되었습니다.');
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
