'use client';

import { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { IoSearchSharp } from 'react-icons/io5';
import { useRouter, useSearchParams } from 'next/navigation';
import { TbEdit } from 'react-icons/tb';
import { useQuery } from '@tanstack/react-query';
import { getAllCourse } from '@/services/courseAdmin/getAllCourse';
import Skeleton from '@mui/material/Skeleton';
import { Modal, message } from 'antd';
import { deleteCourse } from '@/services/courseAdmin/deleteCourse';
import { formattedDate } from '@/utils/dateFormatter';

export default function CourseList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const pagesPerBlock = 5;

  const {
    data: courseListData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['courseListData', currentPage],
    queryFn: () => getAllCourse(currentPage),
  });

  useEffect(() => {
    router.push(`/professor/class/courselist?page=${currentPage}`);
    refetch();
  }, [currentPage, router, refetch]);

  const courseList = courseListData?.data?.data || [];
  const totalPages = courseListData?.data?.count
    ? Math.ceil(courseListData.data.count / 10)
    : 1;

  const currentBlock = Math.ceil(currentPage / pagesPerBlock);
  const startPage = (currentBlock - 1) * pagesPerBlock + 1;
  const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);
  const changePageBlock = (isNext: boolean) => {
    const newPage = isNext
      ? Math.min(endPage + 1, totalPages)
      : Math.max(startPage - pagesPerBlock, 1);
    changePage(newPage);
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
    router.push(`/professor/class/courselist?page=${page}`);
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        {/* Header */}
        <section className="flex flex-col items-center justify-between px-0 md:flex-row md:px-16">
          <h1 className="mb-3 text-lg md:mb-0">개설 강의 목록</h1>
          <div className="flex items-center border-[1px] border-gray-300 rounded-lg px-3 py-2 w-[16rem] bg-white shadow-sm">
            <IoSearchSharp className="mr-2 text-lg text-gray-500" />
            <input
              className="w-full text-sm text-secondary placeholder:text-sm placeholder:font-normal focus:outline-none"
              type="text"
              placeholder="강의 이름으로 검색해보세요"
            />
          </div>
        </section>

        <hr className="mt-5 border-t-2 border-gray-200" />

        {/* Course List */}
        <section className="px-3 overflow-x-auto sm:px-16">
          {isLoading ? (
            <table className="w-full text-sm text-left border-b-2 table-auto">
              <thead>
                <tr>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <th key={index} className="p-4">
                      <Skeleton animation="wave" width="100%" height={30} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 15 }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array.from({ length: 5 }).map((_, colIndex) => (
                      <td key={colIndex} className="p-4">
                        <Skeleton animation="wave" width="100%" height={20} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : courseList.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 py-4">
                등록된 강의가 없습니다.
              </td>
            </tr>
          ) : (
            <table
              className="w-full text-sm text-left border-b-2 table-auto"
              style={{ tableLayout: 'fixed' }}
            >
              <thead>
                <tr className="border-b-2">
                  <th className="p-4">id</th>
                  <th className="p-4">강의코드</th>
                  <th className="p-4">강의명</th>
                  <th className="p-4">생성시간</th>
                </tr>
              </thead>
              <tbody>
                {courseList.map((item: CourseList) => (
                  <tr
                    className="border-b cursor-pointer hover:bg-gray-50"
                    key={item.id}
                    onClick={() =>
                      router.push(`/professor/class/courselist/${item.id}`)
                    }
                  >
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.id}
                    </td>
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.code}
                    </td>
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.title}
                    </td>
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {formattedDate(item.created_time)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Pagination */}
        <section className="flex items-center justify-center w-full px-16 mt-4 sm:justify-end">
          {isLoading ? (
            <div className="flex space-x-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} animation="wave" width={40} height={30} />
              ))}
            </div>
          ) : (
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
          )}
        </section>
      </div>
    </div>
  );
}
