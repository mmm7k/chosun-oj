import api from '../api';

export const postTestcase = async (id: number, data: any) => {
  try {
    const response = await api.post(`/admin/problem/${id}/test_case/`, data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
