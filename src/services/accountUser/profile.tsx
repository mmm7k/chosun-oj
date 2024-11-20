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

export const getSolveGrass = async () => {
  try {
    const response = await api.get('/account/profile/solve_grass');
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getSolveLevel = async () => {
  try {
    const response = await api.get('/account/profile/solve_level');
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getSolveTag = async () => {
  try {
    const response = await api.get('/account/profile/solve_tag');
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
