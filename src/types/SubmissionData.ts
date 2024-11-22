interface SubmissionList {
  id: string;
  code: string;
  language: string;
  result: number;
  ip: string;
  user: {
    username: string;
  };
  create_time: string;
}
