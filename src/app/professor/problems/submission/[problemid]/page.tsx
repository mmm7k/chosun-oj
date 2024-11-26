'use client';

import { useState, useEffect, useRef } from 'react';
import { IoSearchSharp } from 'react-icons/io5';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation, useQuery } from '@tanstack/react-query';
import Skeleton from '@mui/material/Skeleton';
import { Modal, message } from 'antd';
import { formattedDate } from '@/utils/dateFormatter';
import CircularProgress from '@mui/material/CircularProgress';
import { getAllSubmission } from '@/services/submissionAdmin/getAllSubmission';
import { postReSubmit } from '@/services/submissionAdmin/postReSubmit';
import { Select } from 'antd';

const { Option } = Select;

export default function SubmissionList({
  params,
}: {
  params: { problemid: string };
}) {
  const problemId = parseInt(params.problemid);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const pagesPerBlock = 5;
  const [isReSubmitLoading, setIsReSubmitLoading] = useState(false);
  const [openSubmissionId, setOpenSubmissionId] = useState<string | null>(null);
  const initialStatus = searchParams.get('status') || null;
  const initialUser = searchParams.get('user') || null;
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(
    initialStatus,
  );
  const [selectedUser, setSelectedUser] = useState<string | null>(initialUser);

  const {
    data: submissionListData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      'submissionListData',
      currentPage,
      problemId,
      selectedUser,
      selectedStatus,
    ],
    queryFn: () =>
      getAllSubmission(
        currentPage,
        problemId,
        selectedUser || undefined,
        selectedStatus || undefined,
      ),
  });

  const handleFilterChange = (key: 'user' | 'status', value: string | null) => {
    if (key === 'user') setSelectedUser(value);
    if (key === 'status') setSelectedStatus(value);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    const searchValue = searchInputRef.current?.value || '';
    handleFilterChange('user', searchValue);
  };

  useEffect(() => {
    const query = new URLSearchParams();
    query.set('page', currentPage.toString());
    if (selectedUser) query.set('user', selectedUser);
    if (selectedStatus) query.set('status', selectedStatus);
    router.push(
      `/professor/problems/submission/${problemId}?${query.toString()}`,
    );
    refetch();
  }, [currentPage, router, refetch, selectedStatus, selectedUser]);

  const submissionList = submissionListData?.data?.data || [];
  const totalPages = submissionListData?.data?.total_count
    ? Math.ceil(submissionListData.data.total_count / 15)
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

  const reSubmitMutation = useMutation({
    mutationFn: (id: string) => postReSubmit(problemId, id),
    onMutate: () => {
      setIsReSubmitLoading(true);
    },
    onSuccess: () => {
      message.success('재채점을 성공적으로 요청했습니다.');
      // setTimeout(() => {
      //   refetch();
      //   setIsReSubmitLoading(false);
      // }, 3000);
      refetch();
      setIsReSubmitLoading(false);
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

  const handleReSubmit = (id: string) => {
    Modal.confirm({
      title: '재채점 요청',
      content: '해당 제출을 재채점하시겠습니까?',
      onOk: () => reSubmitMutation.mutate(id),
    });
  };

  const toggleAccordion = (id: string) => {
    setOpenSubmissionId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        {/* Header */}
        <section className="flex flex-col items-center justify-between px-0 md:flex-row md:px-16">
          <h1 className="mb-3 text-lg md:mb-0">제출 목록</h1>
          <div className="flex items-center gap-2">
            <Select
              placeholder="정답/오답"
              value={selectedStatus}
              onChange={(value) => handleFilterChange('status', value)}
              className="w-28"
              allowClear
            >
              <Option value={'success'}>정답</Option>
              <Option value={'failed'}>오답</Option>
            </Select>
            <div className="flex items-center border-[1px] border-gray-300 rounded-lg px-3 py-2 w-[16rem] bg-white shadow-sm">
              <IoSearchSharp
                className="mr-2 text-lg text-gray-500"
                onClick={() => handleSearch()}
              />
              <input
                className="w-full text-sm text-secondary placeholder:text-sm placeholder:font-normal focus:outline-none"
                type="text"
                placeholder="유저 이름으로 검색하세요"
                ref={searchInputRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleFilterChange('user', e.currentTarget.value);
                  }
                }}
              />
            </div>
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
          ) : submissionList.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 py-4">
                등록된 제출이 없습니다.
              </td>
            </tr>
          ) : (
            <table
              className="w-full text-sm text-left border-b-2 table-auto"
              style={{ tableLayout: 'fixed' }}
            >
              <thead>
                <tr className="border-b-2">
                  <th className="p-4">언어</th>
                  <th className="p-4">IP</th>
                  <th className="p-4">유저</th>
                  <th className="p-4">제출 시간</th>
                  <th className="p-4">결과</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {submissionList.map((item: SubmissionList) => (
                  <>
                    <tr
                      className="border-b cursor-pointer hover:bg-gray-50"
                      key={item.id}
                      onClick={() => toggleAccordion(item.id)}
                    >
                      <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                        {item.language}
                      </td>
                      <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                        {item.ip}
                      </td>
                      <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                        {item?.user?.name}
                      </td>
                      <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                        {formattedDate(item.create_time)}
                      </td>
                      <td
                        className={`p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap
                    ${item.result === 0 ? 'text-green-500' : 'text-red-500'}
                    `}
                      >
                        {item.result === 0 ? '정답' : '오답'}
                      </td>
                      <td className="flex items-center p-4 space-x-2 ">
                        <button
                          className="px-4 py-2 bg-primary hover:bg-primaryButtonHover transition-all text-white rounded-lg font-normal"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReSubmit(item.id);
                          }}
                        >
                          재채점
                        </button>
                      </td>
                    </tr>
                    {openSubmissionId === item.id && (
                      <tr key={`${item.id}-code`}>
                        <td colSpan={6} className="p-4 ">
                          <pre className="p-4 bg-[#2c2c2c] text-white rounded-md">
                            <code>{item.code}</code>
                          </pre>
                        </td>
                      </tr>
                    )}
                  </>
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
      {isReSubmitLoading && (
        <div
          className="fixed inset-0 z-50 flex flex-col space-y-4 items-center justify-center bg-black bg-opacity-50"
          style={{ color: 'white' }}
        >
          <CircularProgress color="inherit" />
          <span className="text-lg">채점 중 입니다.</span>
        </div>
      )}
    </div>
  );
}
