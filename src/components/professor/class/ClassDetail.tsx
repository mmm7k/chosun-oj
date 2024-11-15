'use client';

import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { getClass } from '@/services/classProfessor/getClass';

export default function ClassDetail() {
  const pathname = usePathname();

  // URL의 마지막 숫자 추출
  const classId = Number(pathname.split('/').pop());

  const { data: classInformation } = useQuery({
    queryKey: ['classInformation', classId],
    queryFn: () => getClass(classId),
    enabled: !!classId, // courseId가 존재할 때만 쿼리 실행
  });

  const classData: ClassData = classInformation?.data || ({} as ClassData);

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
          <h1 className="text-lg">분반 정보</h1>
        </section>
        <hr className="mt-5 border-t-2 border-gray-200" />

        {/* 사용자 정보 표시 */}
        <div className="flex flex-col  text-sm">
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>ID:</span>
            <span>{classData.id}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>과목 코드:</span>
            <span>{classData.course?.code}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>강의명:</span>
            <span>{classData.course?.title}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>분반 이름:</span>
            <span>{classData.group_name}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>분반 정보:</span>
            <span>{classData.description}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>분반 설명:</span>
            <span>{classData.short_description}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>개설년도:</span>
            <span>{classData.year}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>개설학기:</span>
            <span>{classData.quarter}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>언어:</span>
            <span>{classData.language}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>생성 시간:</span>
            <span>{formattedDate(classData.created_time)}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>마지막 수정 시간:</span>
            <span>{formattedDate(classData.last_update_time)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
