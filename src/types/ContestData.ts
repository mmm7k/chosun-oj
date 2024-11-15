interface ContestData {
  id: number;
  created_by: {
    name: string;
  };
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  create_time: string;
  last_update_time: string;
  visible: boolean;
  allowed_ip_ranges: string[];
}
