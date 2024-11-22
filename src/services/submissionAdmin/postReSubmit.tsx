import api from '../api';

export const postReSubmit = async (problemId: number, sumissionId: string) => {
  try {
    const response = await api.post(
      `/admin/problem/${problemId}/submission/${sumissionId}/resubmit`,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
