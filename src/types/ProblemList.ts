interface ProblemList {
  id: number;
  title: string;
  is_visible: boolean;
  is_public: boolean;
  test_case_id: string;
  created_by: {
    name: string;
    username: string;
  };
}
