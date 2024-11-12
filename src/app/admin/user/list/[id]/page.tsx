'use client';

import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/services/accountAdmin/getUser';

export default function UserInformation() {
  const pathname = usePathname();

  // URL의 마지막 숫자 추출
  const userId = Number(pathname.split('/').pop());

  const { data: userInformation } = useQuery({
    queryKey: ['userInformation', userId],
    queryFn: () => getUser(userId),
    enabled: !!userId, // userId가 존재할 때만 쿼리 실행
  });

  const userData = userInformation?.data || {};

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
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>비밀번호:</span>
            <span>{userData.password}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>이름:</span>
            <span>{userData.name}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>권한:</span>
            <span>{userData.admin_type}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>생성 시간:</span>
            <span>{userData.create_time}</span>
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
            <span>계정 활성화 상태:</span>
            <span>{userData.is_disabled ? '비활성화' : '활성화'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
