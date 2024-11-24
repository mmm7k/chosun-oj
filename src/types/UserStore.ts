interface UserStore {
  username: string | null;

  admin_type: string | null;

  isLoading: boolean;

  fetchUser: () => Promise<void>;
  clearUser: () => void;
}
