'use client';

import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getAssignment } from '@/services/assignmentAdmin/getAssignment';

export default function AssignmentDetail() {
  const pathname = usePathname();

  // URL의 마지막 숫자 추출
  const assignmentId = Number(pathname.split('/').pop());

  const { data: assignmentInformation } = useQuery({
    queryKey: ['assignmentInformation', assignmentId],
    queryFn: () => getAssignment(assignmentId),
    enabled: !!assignmentId, // assignmentId가 존재할 때만 쿼리 실행
  });

  const assignmentData: AssignmentData =
    assignmentInformation?.data || ({} as AssignmentData);

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
          <h1 className="text-lg">과제 정보</h1>
        </section>
        <hr className="mt-5 border-t-2 border-gray-200" />

        {/* 사용자 정보 표시 */}
        <div className="flex flex-col  text-sm">
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>ID:</span>
            <span>{assignmentData.id}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10  ">
            <span>과제 제목:</span>
            <span>{assignmentData.title}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>과제 설명:</span>
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
            <span>과제 유형:</span>
            <span>
              {assignmentData.type === 'Assignment' ? '과제' : '퀴즈'}
            </span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>등록 주차:</span>
            <span>{assignmentData.tag}주차</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>등록 분반ID:</span>
            <span>{assignmentData.group}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
