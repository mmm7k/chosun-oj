'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getAssignment } from '@/services/assignmentAdmin/getAssignment';
import { formattedDate } from '@/utils/dateFormatter';
import { MdOutlineLibraryAdd } from 'react-icons/md';
import { TbEdit } from 'react-icons/tb';
import { FiTrash2 } from 'react-icons/fi';
import { deleteAssignment } from '@/services/assignmentAdmin/deleteAssignment';
import { message, Modal } from 'antd';

export default function AssignmentDetail() {
  const pathname = usePathname();
  const router = useRouter();
  // URL의 마지막 숫자 추출
  const assignmentId = Number(pathname.split('/').pop());

  const { data: assignmentInformation } = useQuery({
    queryKey: ['assignmentInformation', assignmentId],
    queryFn: () => getAssignment(assignmentId),
    enabled: !!assignmentId, // assignmentId가 존재할 때만 쿼리 실행
  });

  const assignmentData: AssignmentData =
    assignmentInformation?.data || ({} as AssignmentData);

  const deleteAssignmentMutation = useMutation({
    mutationFn: (id: number) => deleteAssignment(id),
    onSuccess: () => {
      message.success('퀴즈가 성공적으로 삭제되었습니다.');
      router.push('/tutor/assignment/list?page=1');
    },
    onError: (error: any) => {
      if (error.response?.data?.message === '로그인이 필요합니다.') {
        message.error('로그인이 필요합니다.');
        router.push('/');
      } else {
        message.error(error.response?.data?.message || '오류가 발생했습니다.');
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
        deleteAssignmentMutation.mutate(id);
      },
    });
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <div className="flex justify-between items-center  px-16 ">
          <section className="flex">
            <h1 className="text-lg">퀴즈 정보</h1>
          </section>
          <div className="flex items-center gap-2">
            <MdOutlineLibraryAdd
              className="text-lg cursor-pointer lg:text-2xl hover:text-gray-500"
              onClick={() => {
                router.push(`/tutor/assignment/enrollproblem/${assignmentId}`);
              }}
            />

            <TbEdit
              className="text-lg cursor-pointer lg:text-2xl hover:text-gray-500"
              onClick={() => {
                router.push(`/tutor/assignment/edit/${assignmentId}`);
              }}
            />
            <FiTrash2
              className="text-lg cursor-pointer lg:text-2xl hover:text-gray-500"
              onClick={() => {
                handleDelete(assignmentId);
              }}
            />
          </div>
        </div>
        <hr className="mt-5 border-t-2 border-gray-200" />

        {/* 사용자 정보 표시 */}
        <div className="flex flex-col  text-sm">
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>ID:</span>
            <span>{assignmentData.id}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10  ">
            <span>퀴즈 제목:</span>
            <span>{assignmentData.title}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>퀴즈 설명:</span>
            <span>{assignmentData.description}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>시작 시간:</span>
            <span>{formattedDate(assignmentData.start_time)}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>종료 시간:</span>
            <span>{formattedDate(assignmentData.end_time)}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>생성 시간:</span>
            <span>{formattedDate(assignmentData.create_time)}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>마지막 수정 시간:</span>
            <span>
              {assignmentData.last_update_time
                ? formattedDate(assignmentData.last_update_time)
                : formattedDate(assignmentData.create_time)}
            </span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>공개 여부:</span>
            <span>{assignmentData.visible ? '공개' : '비공개'}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>등록 주차:</span>
            <span>{assignmentData.tag}주차</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>등록 분반:</span>
            <span>{assignmentData.group?.group_name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
