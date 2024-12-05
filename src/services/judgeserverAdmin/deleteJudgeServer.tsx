import api from '../api';

export const deleteJudgeServer = async (id: number) => {
  try {
    const response = await api.delete(`/admin/conf/judge_server/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
