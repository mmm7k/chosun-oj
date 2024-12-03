'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getContest } from '@/services/contestAdmin/getContest';
import { formattedDate } from '@/utils/dateFormatter';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { MdOutlineLibraryAdd } from 'react-icons/md';
import { RiUserAddLine } from 'react-icons/ri';
import { TbEdit } from 'react-icons/tb';
import { FiTrash2 } from 'react-icons/fi';
import { deleteContest } from '@/services/contestAdmin/deleteContest';
import { message, Modal } from 'antd';

export default function ContestDetail() {
  const pathname = usePathname();
  const router = useRouter();
  // URL의 마지막 숫자 추출
  const contestId = Number(pathname.split('/').pop());

  const { data: contestInformation } = useQuery({
    queryKey: ['contestInformation', contestId],
    queryFn: () => getContest(contestId),
    enabled: !!contestId, // contestId가 존재할 때만 쿼리 실행
  });

  const contestData: ContestData =
    contestInformation?.data || ({} as ContestData);

  const deleteContestMutation = useMutation({
    mutationFn: (id: number) => deleteContest(id),
    onSuccess: () => {
      message.success('대회가 성공적으로 삭제되었습니다.');
      router.push('/professr/contest/list?page=1');
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
        deleteContestMutation.mutate(id); // 뮤테이션 실행
      },
    });
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <div className="flex justify-between items-center  px-16 ">
          <section className="flex">
            <h1 className="text-lg">대회 정보</h1>
          </section>
          <div className="flex items-center gap-2">
            <IoAlertCircleOutline
              className="text-lg cursor-pointer lg:text-2xl hover:text-gray-500"
              onClick={() => {
                router.push(
                  `/professor/contest/enrollannouncement/${contestId}`,
                );
              }}
            />
            <MdOutlineLibraryAdd
              className="text-lg cursor-pointer lg:text-2xl hover:text-gray-500"
              onClick={() => {
                router.push(`/professor/contest/enrollproblem/${contestId}`);
              }}
            />
            <RiUserAddLine
              className="text-lg cursor-pointer lg:text-2xl hover:text-gray-500"
              onClick={() => {
                router.push(`/professor/contest/enrolluser/${contestId}`);
              }}
            />

            <TbEdit
              className="text-lg cursor-pointer lg:text-2xl hover:text-gray-500"
              onClick={() => {
                router.push(`/professor/contest/edit/${contestId}`);
              }}
            />
            <FiTrash2
              className="text-lg cursor-pointer lg:text-2xl hover:text-gray-500"
              onClick={() => {
                handleDelete(contestId);
              }}
            />
          </div>
        </div>
        <hr className="mt-5 border-t-2 border-gray-200" />

        {/* 사용자 정보 표시 */}
        <div className="flex flex-col  text-sm">
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>ID:</span>
            <span>{contestData.id}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10  ">
            <span>대회 생성:</span>
            <span>{contestData.created_by?.name}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>대회명:</span>
            <span>{contestData.title}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>대회 설명:</span>
            <span>{contestData.description}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>비밀번호:</span>
            <span>******</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>시작 시간:</span>
            <span>{formattedDate(contestData.start_time)}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>종료 시간:</span>
            <span>{formattedDate(contestData.end_time)}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>생성 시간:</span>
            <span>{formattedDate(contestData.create_time)}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>마지막 수정 시간:</span>
            <span>{formattedDate(contestData.last_update_time)}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>공개 여부:</span>
            <span>{contestData.visible ? '공개' : '비공개'}</span>
          </div>
          <div className="flex-col space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>허용 IP 범위:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {contestData.allowed_ip_ranges?.length > 0 ? (
                contestData.allowed_ip_ranges.map((ip, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700"
                  >
                    {ip}
                  </span>
                ))
              ) : (
                <span className="text-gray-500"></span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
