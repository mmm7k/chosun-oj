import { useRouter } from 'next/navigation';
import api from './api';

interface ModifyInfoPayload {
  user: {
    email: string;
  };
  school: string;
  major: string;
}

export const getMyProfile = async () => {
  try {
    const response = await api.get('/account/profile/');
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    window.location.href = '/';
    return error;
  }
};

export const getMyInformation = async () => {
  try {
    const response = await api.get('/account/profile/modify');
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    window.location.href = '/';
    return error;
  }
};

export const modifyInfo = async (payload: ModifyInfoPayload) => {
  try {
    const response = await api.patch('/account/login/modify', payload);
    alert('정보가 수정되었습니다.');
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message);
    window.location.href = '/';
    return error;
  }
};
