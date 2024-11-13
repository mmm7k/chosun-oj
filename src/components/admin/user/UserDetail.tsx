'use client';

import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/services/accountAdmin/getUser';

export default function UserDetail() {
  const pathname = usePathname();

  // URL의 마지막 숫자 추출
  const userId = Number(pathname.split('/').pop());

  const { data: userInformation } = useQuery({
    queryKey: ['userInformation', userId],
    queryFn: () => getUser(userId),
    enabled: !!userId, // userId가 존재할 때만 쿼리 실행
  });

  const userData: UserData = userInformation?.data || ({} as UserData);
  // admin_type에 따른 권한 매핑
  const matchingRole: { [key: string]: string } = {
    'Regular User': '학생',
    Professor: '교수',
    'Super Admin': '관리자',
  };

  const formattedDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <section className="flex px-16">
          <h1 className="text-lg">유저 정보</h1>
        </section>
        <hr className="mt-5 border-t-2 border-gray-200" />

        {/* 사용자 정보 표시 */}
        <div className="flex flex-col  text-sm">
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>아이디:</span>
            <span>{userData.username}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10  ">
            <span>비밀번호:</span>
            <span>*******</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>이름:</span>
            <span>{userData.name}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>권한:</span>
            <span> {matchingRole[userData.admin_type] || 'undefined'}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>생성 시간:</span>
            <span>{formattedDate(userData.create_time)}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>이메일:</span>
            <span>{userData.email}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>학번:</span>
            <span>{userData.student_number}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>문제 접근 권한:</span>
            <span>{userData.problem_permission}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>계정 활성화 상태:</span>
            <span>{userData.is_disabled ? '비활성화' : '활성화'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
