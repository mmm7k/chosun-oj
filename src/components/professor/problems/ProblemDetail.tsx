'use client';

import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getProblem } from '@/services/problemAdmin/getProblem';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const Viewer = dynamic(
  () => import('@toast-ui/react-editor').then((mod) => mod.Viewer),
  {
    ssr: false,
  },
);

export default function ProblemDetail() {
  const pathname = usePathname();
  // URL의 마지막 숫자 추출
  const problemId = Number(pathname.split('/').pop());

  const { data: problemInformation } = useQuery({
    queryKey: ['problemInformation', problemId],
    queryFn: () => getProblem(problemId),
    enabled: !!problemId, // problemId가 존재할 때만 쿼리 실행
  });

  const problemData: ProblemData =
    problemInformation?.data || ({} as ProblemData);

  const formattedDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const [isViewerReady, setIsViewerReady] = useState(false);

  useEffect(() => {
    if (problemData.description) {
      setIsViewerReady(true);
    }
  }, [problemData.description]);

  if (!isViewerReady) {
    return null;
  }
  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <section className="flex px-16">
          <h1 className="text-lg">문제 정보</h1>
        </section>
        <hr className="mt-5 border-t-2 border-gray-200" />

        {/* 사용자 정보 표시 */}
        <div className="flex flex-col  text-sm">
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>ID:</span>
            <span>{problemData.id}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10  ">
            <span>출제자:</span>
            <span>{problemData.created_by?.name}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>문제 제목:</span>
            <span>{problemData.title}</span>
          </div>
          <div className="flex flex-col space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>문제 본문:</span>
            <Viewer
              initialValue={problemData.description || '내용이 없습니다.'}
            />
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>공개 여부:</span>
            <span>{problemData.is_visible ? '공개' : '비공개'}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>대회/과제용 여부:</span>
            <span>{problemData.is_public ? '대회/과제용' : '공통문제'}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>시간 제한:</span>
            <span>{problemData.time_limit}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>메모리 제한:</span>
            <span>{problemData.memory_limit}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>태그:</span>
            <span>{problemData.tags}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>난이도:</span>
            <span>{problemData.difficulty}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>점수:</span>
            <span>{problemData.test_case_score?.score}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>언어:</span>
            <span>{problemData.languages}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>생성 시간:</span>
            <span>{formattedDate(problemData.created_time)}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>마지막 수정 시간:</span>
            <span>{formattedDate(problemData.last_update_time)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
