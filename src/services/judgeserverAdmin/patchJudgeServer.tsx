import api from '../api';

export const patchJudgeServer = async (id: number, data: any) => {
  try {
    const response = await api.patch(`/admin/conf/judge_server/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
