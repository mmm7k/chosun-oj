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

import { MdOutlineLibraryAdd } from 'react-icons/md';
import { getAllAssignment } from '@/services/assignmentAdmin/getAllAssignment';
import { deleteAssignment } from '@/services/assignmentAdmin/deleteAssignment';
import Link from 'next/link';

export default function AssignmentList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const pagesPerBlock = 5;

  const {
    data: assignmentListData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['assignmentListData', currentPage],
    queryFn: () => getAllAssignment(currentPage),
  });

  useEffect(() => {
    router.push(`/tutor/assignment/list?page=${currentPage}`);
    refetch();
  }, [currentPage, router, refetch]);

  const assignmentList = assignmentListData?.data?.data || [];
  const totalPages = assignmentListData?.data?.total_count
    ? Math.ceil(assignmentListData.data.total_count / 15)
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

  const deleteAssignmentMutation = useMutation({
    mutationFn: (id: number) => deleteAssignment(id),
    onSuccess: () => {
      message.success('퀴즈가 성공적으로 삭제되었습니다.');
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
        deleteAssignmentMutation.mutate(id);
      },
    });
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        {/* Header */}
        <section className="flex flex-col items-center justify-between px-0 md:flex-row md:px-16">
          <h1 className="mb-3 text-lg md:mb-0">퀴즈 목록</h1>
          {/* <div className="flex items-center border-[1px] border-gray-300 rounded-lg px-3 py-2 w-[16rem] bg-white shadow-sm">
            <IoSearchSharp className="mr-2 text-lg text-gray-500" />
            <input
              className="w-full text-sm text-secondary placeholder:text-sm placeholder:font-normal focus:outline-none"
              type="text"
              placeholder="퀴즈 이름으로 검색해보세요"
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
          ) : assignmentList.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 py-4">
                등록된 퀴즈가 없습니다.
              </td>
            </tr>
          ) : (
            <table
              className="w-full text-sm text-left border-b-2 table-auto"
              style={{ tableLayout: 'fixed' }}
            >
              <thead>
                <tr className="border-b-2">
                  <th className="p-4">퀴즈명</th>

                  <th className="p-4">주차</th>
                  <th className="p-4">등록분반</th>
                  <th className="p-4">퀴즈관리</th>
                </tr>
              </thead>
              <tbody>
                {assignmentList.map((item: AssignmentList) => (
                  <tr
                    className="border-b cursor-pointer hover:bg-gray-50"
                    key={item.id}
                    onClick={() =>
                      router.push(`/tutor/assignment/list/${item.id}`)
                    }
                  >
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.title}
                    </td>

                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.tag}주차
                    </td>

                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.group?.group_name}
                    </td>

                    <td className="flex items-center p-4 space-x-2 ">
                      <MdOutlineLibraryAdd
                        className="text-lg cursor-pointer lg:text-xl hover:text-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/tutor/assignment/enrollproblem/${item.id}`,
                          );
                        }}
                      />

                      <TbEdit
                        className="text-lg cursor-pointer lg:text-xl hover:text-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/tutor/assignment/edit/${item.id}`);
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
            <Link href="/tutor/assignment/post">
              <button
                className="px-4 py-2 text-sm font-normal text-white bg-primary rounded-xl hover:bg-primaryButtonHover"
                type="submit"
              >
                퀴즈 등록
              </button>
            </Link>
            <Link href="/tutor/assignment/submission">
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
