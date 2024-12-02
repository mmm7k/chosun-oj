'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getUser } from '@/services/accountAdmin/getUser';
import { formattedDate } from '@/utils/dateFormatter';
import { TbEdit } from 'react-icons/tb';
import { FiTrash2 } from 'react-icons/fi';
import { deleteUser } from '@/services/accountAdmin/deleteUser';
import { message, Modal } from 'antd';

export default function UserDetail() {
  const pathname = usePathname();
  const router = useRouter();
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
    Tutor: '튜터',
  };

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      message.success('유저가 성공적으로 삭제되었습니다.');
      router.push('/admin/user/list?page=1');
    },
    onError: (error: any) => {
      if (error.response?.data?.message === '로그인이 필요합니다.') {
        alert(error.response?.data?.message);
        router.push('/');
      } else {
        message.error(
          error.response?.data?.message || '삭제 중 오류가 발생했습니다.',
        );
      }
    },
  });

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '정말 삭제하시겠습니까?',
      content: '이 작업은 되돌릴 수 없습니다.',
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk: () => {
        deleteMutation.mutate(id); // 삭제 뮤테이션 호출
      },
    });
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <div className="flex justify-between items-center  px-16 ">
          <section className="flex">
            <h1 className="text-lg">유저 정보</h1>
          </section>
          <div className="flex items-center gap-2">
            <TbEdit
              className="text-lg cursor-pointer lg:text-2xl hover:text-gray-500"
              onClick={(e) => {
                router.push(`/admin/user/edit/${userId}`);
              }}
            />
            <FiTrash2
              className="text-lg cursor-pointer lg:text-2xl hover:text-gray-500"
              onClick={() => {
                handleDelete(userId);
              }}
            />
          </div>
        </div>
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
