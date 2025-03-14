import api from '../api';

export const checkUsername = async (username: string) => {
  try {
    const response = await api.post('/account/check_username/', {
      username,
    });
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const checkEmail = async (email: string) => {
  try {
    const response = await api.post('/account/check_email/', { email });
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const checkStudentNumber = async (studentNumber: string) => {
  try {
    const response = await api.post('/account/check_student_number/', {
      student_number: studentNumber,
    });
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const registerUser = async (data: any) => {
  try {
    const response = await api.post('/account/register/', data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
