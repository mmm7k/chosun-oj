interface ProblemData {
  id: number;
  title: string;
  description: string;
  created_by: {
    name: string;
  };
  is_visible: boolean;
  is_public: boolean;
  created_time: string;
  last_update_time: string;
  time_limit: number;
  memory_limit: number;
  tags: string[];
  difficulty: string;
  test_case_score: {
    score: number;
  };
  languages: string[];
}
