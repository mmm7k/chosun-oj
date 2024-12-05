'use client';

import { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { IoAlertCircleOutline, IoSearchSharp } from 'react-icons/io5';
import { useRouter, useSearchParams } from 'next/navigation';
import { TbEdit } from 'react-icons/tb';
import { useMutation, useQuery } from '@tanstack/react-query';
import Skeleton from '@mui/material/Skeleton';
import { Modal, message } from 'antd';
import { RiUserAddLine } from 'react-icons/ri';
import { getAllContest } from '@/services/contestAdmin/getAllContest';
import { deleteContest } from '@/services/contestAdmin/deleteContest';
import { MdOutlineLibraryAdd } from 'react-icons/md';
import Link from 'next/link';
import { GrScorecard } from 'react-icons/gr';

export default function ContestList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const pagesPerBlock = 5;

  const {
    data: contestListData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['contestListData', currentPage],
    queryFn: () => getAllContest(currentPage),
  });

  useEffect(() => {
    router.push(`/professor/contest/list?page=${currentPage}`);
    refetch();
  }, [currentPage, router, refetch]);

  const contestList = contestListData?.data?.data || [];
  const totalPages = contestListData?.data?.total_count
    ? Math.ceil(contestListData.data.total_count / 15)
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

  const deleteContestMutation = useMutation({
    mutationFn: (id: number) => deleteContest(id),
    onSuccess: () => {
      message.success('대회가 성공적으로 삭제되었습니다.');
      refetch();
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
        deleteContestMutation.mutate(id);
      },
    });
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        {/* Header */}
        <section className="flex flex-col items-center justify-between px-0 md:flex-row md:px-16">
          <h1 className="mb-3 text-lg md:mb-0">대회 목록</h1>
          {/* <div className="flex items-center border-[1px] border-gray-300 rounded-lg px-3 py-2 w-[16rem] bg-white shadow-sm">
            <IoSearchSharp className="mr-2 text-lg text-gray-500" />
            <input
              className="w-full text-sm text-secondary placeholder:text-sm placeholder:font-normal focus:outline-none"
              type="text"
              placeholder="대회 이름으로 검색해보세요"
            />
          </div> */}
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
          ) : contestList.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 py-4">
                등록된 대회가 없습니다.
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
                  <th className="p-4">대회명</th>
                  <th className="p-4">대회생성</th>
                  <th className="p-4">대회 관리</th>
                </tr>
              </thead>
              <tbody>
                {contestList.map((item: ContestList) => (
                  <tr
                    className="border-b cursor-pointer hover:bg-gray-50"
                    key={item.id}
                    onClick={() =>
                      router.push(`/professor/contest/list/${item.id}`)
                    }
                  >
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.id}
                    </td>
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.title}
                    </td>
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.created_by.name}
                    </td>

                    <td className="flex items-center p-4 space-x-2 ">
                      <GrScorecard
                        className="text-lg cursor-pointer  hover:text-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/professor/contest/scoreboard/${item.id}`,
                          );
                        }}
                      />

                      <IoAlertCircleOutline
                        className="text-lg cursor-pointer lg:text-xl hover:text-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/professor/contest/enrollannouncement/${item.id}`,
                          );
                        }}
                      />

                      <MdOutlineLibraryAdd
                        className="text-lg cursor-pointer lg:text-xl hover:text-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/professor/contest/enrollproblem/${item.id}`,
                          );
                        }}
                      />
                      <RiUserAddLine
                        className="text-lg cursor-pointer lg:text-xl hover:text-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/professor/contest/enrolluser/${item.id}`,
                          );
                        }}
                      />
                      <TbEdit
                        className="text-lg cursor-pointer lg:text-xl hover:text-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/professor/contest/edit/${item.id}`);
                        }}
                      />
                      <FiTrash2
                        className="text-lg cursor-pointer lg:text-xl hover:text-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Pagination */}
        <section className="flex items-center w-full px-3 sm:px-16 mt-4 justify-between">
          <div className="flex space-x-3">
            <Link href="/professor/contest/post">
              <button
                className="px-4 py-2 text-sm font-normal text-white bg-primary rounded-xl hover:bg-primaryButtonHover"
                type="submit"
              >
                대회 등록
              </button>
            </Link>
            <Link href="/professor/contest/submission">
              <button
                className="px-4 py-2 text-sm font-normal text-white bg-primary rounded-xl hover:bg-primaryButtonHover"
                type="submit"
              >
                제출 확인
              </button>
            </Link>
          </div>
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
