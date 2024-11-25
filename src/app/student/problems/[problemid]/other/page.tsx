'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getProblemDetailUser } from '@/services/problemUser/getProblemDetailUser';
import Link from 'next/link';
import { getOtherSubmissionUser } from '@/services/problemUser/getOtherSubmissionUser';
import Skeleton from '@mui/material/Skeleton';

export default function Problem({ params }: { params: { problemid: string } }) {
  const problemId = parseInt(params.problemid);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const pagesPerBlock = 5;
  const [shouldRender, setShouldRender] = useState(false);

  // 문제 상세 정보 가져오기
  const {
    data: problemData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['problemData', problemId],
    queryFn: () => getProblemDetailUser(problemId),
  });

  const problem = problemData?.data || {};

  // 제출 내역
  const {
    data: otherSubmissionListData,
    refetch,
    isLoading: submissionLoading,
  } = useQuery({
    queryKey: ['otherSubmissionListData', problemId, currentPage],
    queryFn: () => getOtherSubmissionUser(currentPage, problemId),
    enabled: shouldRender,
  });

  useEffect(() => {
    router.push(`/student/problems/${problemId}/other?page=${currentPage}`);
    refetch();
  }, [currentPage, router, refetch]);

  const submissionList = otherSubmissionListData?.data?.data || [];
  const totalPages = otherSubmissionListData?.data?.total_count
    ? Math.ceil(otherSubmissionListData.data.total_count / 5)
    : 1;
  const currentBlock = Math.ceil(currentPage / pagesPerBlock);
  const startPage = (currentBlock - 1) * pagesPerBlock + 1;
  const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  const changePageBlock = (isNext: boolean) => {
    const newPage = isNext
      ? Math.min(endPage + 1, totalPages)
      : Math.max(startPage - pagesPerBlock, 1);
    changePage(newPage);
  };

  const handleBack = () => {
    router.back();
  };

  // 문제 상세 정보 가져오기 실패 시
  useEffect(() => {
    if (isError) {
      alert('문제 정보를 불러오는 중 오류가 발생했습니다.');
      router.push('/student');
    } else if (!isLoading && !problem.is_solved) {
      alert('해당 문제는 아직 풀지 않은 문제입니다.');
      router.push('/student');
    } else if (!isLoading) {
      setShouldRender(true); // 로딩이 끝난 후 렌더링 허용
    }
  }, [isLoading, isError, problem, router]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div className="flex flex-col pb-10 ">
      {/* 헤더 */}
      <Link href="/">
        <div className="flex items-center h-20 px-4 text-white lg:h-14 bg-darkPrimary sm:px-12 cursor-pointer">
          <div className="relative mr-3 w-9 h-9">
            <Image
              src={'/commons/whiteSymbol.png'}
              alt="Logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <span className="text-lg">Chosun Online Judge</span>
        </div>
      </Link>
      {/* 문제 이름 */}
      <div className="w-full  h-14 border-b-[1.5px] bg-white border-gray-300 px-4 sm:px-12 flex justify-between items-center">
        <div className="flex items-center">
          <div
            className={
              'mt-4  pb-3  text-primary border-primary border-b-[4px] font-semibold '
            }
          >
            {problem.title}
          </div>
        </div>
        <button
          className="px-4 py-2 text-gray-800 transition bg-slate-200 rounded-md hover:bg-gray-300"
          onClick={handleBack}
        >
          이전으로
        </button>
      </div>

      {/* 제출 내역 */}
      <div className="flex flex-col items-center mt-5 w-full">
        {submissionLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="w-[40%] flex flex-col mb-6 p-4 border rounded-lg shadow-sm bg-gray-50 space-y-3"
            >
              <Skeleton variant="text" width="60%" height={30} />
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="rectangular" width="100%" height={120} />
            </div>
          ))
        ) : submissionList.length === 0 ? (
          <p className="text-gray-500 mt-6">제출 내역이 없습니다.</p>
        ) : (
          submissionList.map((submission: any) => (
            <div
              key={submission.id}
              className="w-[40%] flex flex-col mb-6 p-4 border rounded-lg shadow-md bg-white "
            >
              <div className="flex items-center mb-3">
                <span className="font-bold text-lg text-gray-800">
                  {submission?.user?.username}
                </span>
              </div>
              <div className="space-x-4 text-sm text-gray-600 mb-3">
                <span>⏱ {submission?.info?.data[0]?.real_time}ms</span>
                <span>
                  💾{' '}
                  {typeof submission?.info?.data[0]?.memory === 'number'
                    ? (submission.info.data[0].memory / (1024 * 1024)).toFixed(
                        2,
                      )
                    : 'N/A'}
                  MB
                </span>
                <span>🖋 {submission?.language}</span>
              </div>
              <pre className="bg-slate-900 rounded-md p-3 text-sm text-white overflow-x-auto">
                <code>{submission?.code}</code>
              </pre>
            </div>
          ))
        )}
      </div>
      {/* Pagination */}
      <section className="flex items-center justify-center w-full px-16 mt-4">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => changePageBlock(false)}
            disabled={currentBlock === 1}
            className={`px-3 py-1 rounded-xl ${
              currentBlock === 1
                ? 'bg-gray-200 opacity-50 '
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            &lt;
          </button>
          <div className="flex space-x-1 font-normal">
            {Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => startPage + i,
            ).map((page) => (
              <button
                key={page}
                onClick={() => changePage(page)}
                className={`px-3 py-1 rounded-xl transition-all ${
                  page === currentPage
                    ? 'bg-primary text-white hover:bg-primaryButtonHover'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => changePageBlock(true)}
            disabled={endPage === totalPages}
            className={`px-3 py-1 rounded-xl ${
              endPage === totalPages
                ? 'bg-gray-200 opacity-50'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            &gt;
          </button>
        </div>
      </section>
    </div>
  );
}
