'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAssignmentDetailUser } from '@/services/assignmentUser/getAssignmentDetailUser';
import Image from 'next/image';
import { formattedDate } from '@/utils/dateFormatter';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getAssignmentProblemListUser } from '@/services/assignmentUser/getAssignmentProblemListUser';
import Link from 'next/link';
import Skeleton from '@mui/material/Skeleton';
export default function AssignmentDetail({
  params,
}: {
  params: { classid: string; assignmentid: string };
}) {
  const classId = parseInt(params.classid);
  const assignmentId = parseInt(params.assignmentid);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const initialPage = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const pagesPerBlock = 5;

  const { data: assignmentDetailData } = useQuery({
    queryKey: ['assignmentDetailData'],
    queryFn: () => getAssignmentDetailUser(classId, assignmentId),
  });

  const assignment = assignmentDetailData?.data || {};

  const {
    data: assignmentProblemListData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['assignmentProblemListData'],
    queryFn: () =>
      getAssignmentProblemListUser(currentPage, classId, assignmentId),
  });

  useEffect(() => {
    router.push(
      `/student/assignment/${classId}/${assignmentId}?page=${currentPage}`,
    );
    refetch();
  }, [currentPage, router, refetch]);

  const assignmentProblemList = assignmentProblemListData?.data?.data || [];
  console.log(assignmentProblemList);
  const totalPages = assignmentProblemListData?.data?.total_count
    ? Math.ceil(assignmentProblemListData.data.total_count / 15)
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
      <section className="w-screen h-44 bg-gradient-to-r from-[#9face6] to-[#74ebd5]  ">
        <div className="w-screen px-[10%] lg:px-[20%] h-44">
          <div className="flex items-center justify-between h-44">
            <div
              className="flex flex-col gap-1 text-2xl text-white "
              style={{ textShadow: '1px 2px 3px rgba(0, 0, 0, 0.5)' }}
            >
              <span>🏆 {assignment.title}</span>
              <span>
                ⏱️ {formattedDate(assignment.start_time)} ~{' '}
                {formattedDate(assignment.end_time)}
              </span>
            </div>
            <div className="w-[50%] h-[90%] relative">
              <Image
                src={'/banner/assignmentBanner.png'}
                layout="fill"
                objectFit="contain"
                alt="banner1"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#f0f4fc] min-h-screen w-full flex  justify-center">
        <div className="w-[90%] lg:w-[62%] pt-12 mb-44">
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
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm py-5 px-5 border-b hover:bg-[#eeeff3] cursor-pointer"
                  >
                    <span className="w-[10%]">
                      <Skeleton animation="wave" width="100%" height={20} />
                    </span>
                    <span className="w-[50%]">
                      <Skeleton animation="wave" width="100%" height={20} />
                    </span>
                    <span className="w-[10%]">
                      <Skeleton animation="wave" width="80%" height={20} />
                    </span>
                    <span className="w-[10%]">
                      <Skeleton animation="wave" width="60%" height={20} />
                    </span>
                    <span className="w-[10%]">
                      <Skeleton animation="wave" width="70%" height={20} />
                    </span>
                  </div>
                ))
              ) : assignmentProblemList.length === 0 ? (
                <div className="text-center text-gray-500 py-5">
                  등록된 문제가 없습니다
                </div>
              ) : (
                assignmentProblemList.map((problemItem: any) => (
                  <Link
                    href={`${pathname}/${problemItem.id}`}
                    key={problemItem.id}
                  >
                    <div className="flex justify-between items-center text-sm py-5 px-5 border-b hover:bg-[#eeeff3] cursor-pointer">
                      <span className="w-[10%] text-green-500 font-bold pl-2">
                        {problemItem.is_solved === true ? '✔' : ''}
                      </span>
                      <span className="w-[50%]">{problemItem.title}</span>
                      <span
                        className={`w-[10%] font-semibold ${
                          problemItem.difficulty === 'Low'
                            ? 'text-green-400'
                            : problemItem.difficulty === 'Middle'
                              ? 'text-sky-400'
                              : 'text-rose-400'
                        }`}
                      >
                        {problemItem.difficulty === 'Low'
                          ? 'Lv.1'
                          : problemItem.difficulty === 'Middle'
                            ? 'Lv.2'
                            : 'Lv.3'}
                      </span>
                      <span className="w-[10%] flex items-center">
                        {problemItem.submission_number}
                      </span>
                      <span className="w-[10%] flex items-center">
                        {problemItem.accuracy}%
                      </span>
                    </div>
                  </Link>
                ))
              )}
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
        </div>
      </div>
    </>
  );
}
