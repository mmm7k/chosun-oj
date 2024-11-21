'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getContestProblemListUser } from '@/services/contestUser/getContestProblemListUser';

export default function ContestProblemList({
  contestId,
}: {
  contestId: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const initialPage = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const pagesPerBlock = 5;

  const { data: contestProblemListData, refetch } = useQuery({
    queryKey: ['contestProblemListData'],
    queryFn: () => getContestProblemListUser(currentPage, contestId),
  });

  useEffect(() => {
    router.push(`/student/contest/${contestId}?page=${currentPage}`);
    refetch();
  }, [currentPage, router, refetch]);

  const contestProblemList = contestProblemListData?.data?.data || [];
  const totalPages = contestProblemListData?.data?.total_count
    ? Math.ceil(contestProblemListData.data.total_count / 15)
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

  return (
    <>
      <main className="w-full">
        {/* 문제 목록 */}
        <div className="text-sm text-gray-500 bg-white border shadow-md rounded-2xl">
          <div className="flex justify-between items-center rounded-t-2xl py-2 px-5 border-b bg-[#eeeff3] text-gray-800">
            <span className="w-[10%]">상태</span>
            <span className="w-[50%]">문제 이름</span>
            <span className="w-[10%]">난이도</span>
            <span className="w-[10%]">제출</span>
            <span className="w-[10%]">정답률</span>
          </div>
          {contestProblemList.map((problemItem: any) => (
            <Link
              href={`${pathname}/${problemItem.problem.id}`}
              key={problemItem.problem.id}
            >
              <div className="flex justify-between items-center text-sm py-5 px-5 border-b hover:bg-[#eeeff3] cursor-pointer ">
                <span className="w-[10%] text-green-500 font-bold">
                  {/* {item.solved === 'solved' ? '✔' : ''} */}
                </span>
                <span className="w-[50%]">{problemItem.problem.title}</span>
                <span
                  className={`w-[10%] font-semibold ${
                    problemItem.problem.difficulty === 'Low'
                      ? 'text-green-400'
                      : problemItem.problem.difficulty === 'Middle'
                        ? 'text-sky-400'
                        : 'text-rose-400'
                  }`}
                >
                  {problemItem.problem.difficulty === 'Low'
                    ? 'Lv.1'
                    : problemItem.problem.difficulty === 'Middle'
                      ? 'Lv.2'
                      : 'Lv.3'}
                </span>
                <span className="w-[10%] flex items-center">
                  {problemItem.problem.submission_number}
                </span>
                <span className="w-[10%] flex items-center">
                  {problemItem.problem.submission_number > 0
                    ? `${((problemItem.problem.accept_number / problemItem.problem.submission_number) * 100).toFixed(2)}%`
                    : 'N/A'}
                </span>
              </div>
            </Link>
          ))}
        </div>
        {/* 페이지네이션 */}
        <div className="flex items-center justify-center mt-16 space-x-1">
          <button
            onClick={() => changePageBlock(false)}
            disabled={currentBlock === 1}
            className={`px-3 py-1 bg-white rounded-2xl shadow-md hover:bg-[#eeeff3]
            ${currentBlock === 1 ? 'opacity-40' : ''}
            `}
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
            className={`px-3 py-1 bg-white rounded-2xl shadow-md hover:bg-[#eeeff3]
          ${currentBlock === 1 ? 'opacity-40' : ''}
          `}
          >
            &gt;
          </button>
        </div>
      </main>
    </>
  );
}
