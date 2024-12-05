import api from '../api';

export const getJudgeServer = async () => {
  try {
    const response = await api.get(`/conf/judge_server`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
