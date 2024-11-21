'use client';

import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { getCourse } from '@/services/courseAdmin/getCourse';
import { formattedDate } from '@/utils/dateFormatter';

export default function CourseDetail() {
  const pathname = usePathname();

  // URL의 마지막 숫자 추출
  const courseId = Number(pathname.split('/').pop());

  const { data: courseInformation } = useQuery({
    queryKey: ['courseInformation', courseId],
    queryFn: () => getCourse(courseId),
    enabled: !!courseId, // courseId가 존재할 때만 쿼리 실행
  });

  const courseData: CourseData = courseInformation?.data || ({} as CourseData);

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <section className="flex px-16">
          <h1 className="text-lg">강의 정보</h1>
        </section>
        <hr className="mt-5 border-t-2 border-gray-200" />

        {/* 사용자 정보 표시 */}
        <div className="flex flex-col  text-sm">
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>ID:</span>
            <span>{courseData.id}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10  ">
            <span>강의 코드:</span>
            <span>{courseData.code}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>강의 이름:</span>
            <span>{courseData.title}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>강의 설명:</span>
            <span>{courseData.description}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>생성 시간:</span>
            <span>{formattedDate(courseData.created_time)}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>마지막 수정 시간:</span>
            <span>{formattedDate(courseData.last_update_time)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
