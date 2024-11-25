interface SubmissionList {
  id: string;
  code: string;
  language: string;
  result: number;
  ip: string;
  user: {
    username: string;
    name: string;
  };
  create_time: string;
}
