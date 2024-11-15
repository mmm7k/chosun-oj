import api from '../api';

export const enrollUsers = async (users: any[]) => {
  const payload = {
    users: users.map((user) => [
      user.userId,
      user.userPassword,
      user.userEmail,
      user.userNumber,
      user.userName,
    ]),
  };

  try {
    const response = await api.post('/admin/account/users', payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
