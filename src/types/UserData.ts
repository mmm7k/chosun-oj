interface UserData {
  username: string;
  name: string;
  admin_type: 'Regular User' | 'Professor' | 'Super Admin';
  create_time: string;
  email: string;
  student_number: string;
  is_disabled: boolean;
  problem_permission: string;
}
