interface ProblemList {
  id: number;
  title: string;
  is_visible: boolean;
  is_public: boolean;
  created_by: {
    name: string;
  };
}
