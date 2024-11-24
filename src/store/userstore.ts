import { create } from 'zustand';
import { getUserRoleType } from '@/services/accountUser/getUserRoleType';

const useUserStore = create<UserStore>((set) => ({
  username: null, // 유저 이름(아이디)
  admin_type: null, // 유저 타입
  isLoading: false, // 로딩 상태
  setUser: (username: string, admin_type: string) =>
    set({ username, admin_type }), // 상태 업데이트 함수
  clearUser: () => set({ username: null, admin_type: null }), // 상태 초기화 함수
  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const response = await getUserRoleType(); // 유저 정보 요청
      const { username, admin_type } = response.data; // 배열 구조 분해
      set({ username, admin_type }); // Zustand 상태 업데이트
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useUserStore;
