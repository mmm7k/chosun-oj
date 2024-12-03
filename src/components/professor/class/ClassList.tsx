'use client';

import { useState, useEffect, useRef } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { IoAlertCircleOutline, IoSearchSharp } from 'react-icons/io5';
import { useRouter, useSearchParams } from 'next/navigation';
import { TbEdit } from 'react-icons/tb';
import { useMutation, useQuery } from '@tanstack/react-query';
import Skeleton from '@mui/material/Skeleton';
import { Modal, message } from 'antd';
import { getAllClass } from '@/services/classAdmin/getAllClass';
import { deleteClass } from '@/services/classAdmin/deleteClass';
import { RiUserAddLine } from 'react-icons/ri';
import Link from 'next/link';
import { Select } from 'antd';

const { Option } = Select;

export default function ClassList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const pagesPerBlock = 5;

  const initialSearch = searchParams.get('search') || null;
  const initialYear = searchParams.get('year') || null;
  const initialQuarter = searchParams.get('quarter') || null;
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedSearch, setSelectedSearch] = useState<string | null>(
    initialSearch,
  );
  const [selectedYear, setSelectedYear] = useState<string | null>(initialYear);
  const [selectedQuarter, setSelectedQuarter] = useState<string | null>(
    initialQuarter,
  );

  const {
    data: classListData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      'classListData',
      currentPage,
      selectedSearch,
      selectedYear,
      selectedQuarter,
    ],
    queryFn: () =>
      getAllClass(
        currentPage,
        selectedSearch || undefined,
        selectedYear || undefined,
        selectedQuarter || undefined,
      ),
  });

  const handleFilterChange = (
    key: 'search' | 'year' | 'quarter',
    value: string | null,
  ) => {
    if (key === 'search') {
      setSelectedSearch(value);
    }
    if (key === 'year') {
      setSelectedYear(value);
    }
    if (key === 'quarter') {
      setSelectedQuarter(value);
    }
    setCurrentPage(1);
  };

  const handleSearch = () => {
    const searchValue = searchInputRef.current?.value || '';
    handleFilterChange('search', searchValue);
  };

  // useEffect(() => {
  //   router.push(`/professor/class/list?page=${currentPage}`);
  //   refetch();
  // }, [currentPage, router, refetch]);

  useEffect(() => {
    const query = new URLSearchParams();
    query.set('page', currentPage.toString());
    if (selectedSearch) query.set('search', selectedSearch);
    if (selectedYear) query.set('year', selectedYear);
    if (selectedQuarter) query.set('quarter', selectedQuarter);

    router.push(`/professor/class/list?${query.toString()}`);
    refetch();
  }, [
    currentPage,
    router,
    refetch,
    selectedSearch,
    selectedYear,
    selectedQuarter,
  ]);

  const classList = classListData?.data?.data || [];
  const totalPages = classListData?.data?.count
    ? Math.ceil(classListData.data.count / 10)
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
    router.push(`/professor/class/list?page=${page}`);
  };

  const deleteClassMutation = useMutation({
    mutationFn: (id: number) => deleteClass(id),
    onSuccess: () => {
      message.success('분반이 성공적으로 삭제되었습니다.');
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
        deleteClassMutation.mutate(id);
      },
    });
  };
  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        {/* Header */}
        <section className="flex flex-col items-center justify-between px-0 md:flex-row md:px-16">
          <h1 className="mb-3 text-lg md:mb-0">분반 목록</h1>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="space-x-2">
              <Select
                placeholder="년도"
                value={selectedYear}
                onChange={(value) => handleFilterChange('year', value)}
                className="w-28"
                allowClear
              >
                <Option value={'2024'}>2024</Option>
                <Option value={'2025'}>2025</Option>
              </Select>

              <Select
                placeholder="학기"
                value={selectedQuarter}
                onChange={(value) => handleFilterChange('quarter', value)}
                className="w-36"
                allowClear
              >
                <Option value={'1학기'}>1학기</Option>
                <Option value={'2학기'}>2학기</Option>
                <Option value={'동계계절학기'}>동계계절학기</Option>
                <Option value={'하계계절학기'}>하계계절학기</Option>
              </Select>
            </div>

            <div className="flex items-center border-[1px] border-gray-300 rounded-lg px-3 py-2 w-[16rem] bg-white shadow-sm">
              <IoSearchSharp
                className="mr-2 text-lg text-gray-500"
                onClick={() => handleSearch()}
              />
              <input
                className="w-full text-sm text-secondary placeholder:text-sm placeholder:font-normal focus:outline-none"
                type="text"
                placeholder="분반이름을 검색해보세요"
                ref={searchInputRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleFilterChange('search', e.currentTarget.value);
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
          ) : classList.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 py-4">
                등록된 분반이 없습니다.
              </td>
            </tr>
          ) : (
            <table
              className="w-full text-sm text-left border-b-2 table-auto"
              style={{ tableLayout: 'fixed' }}
            >
              <thead>
                <tr className="border-b-2">
                  <th className="p-4">강의코드</th>
                  <th className="p-4">강의명</th>
                  <th className="p-4">분반명</th>
                  <th className="p-4">년도</th>
                  <th className="p-4">학기</th>
                  <th className="p-4">분반 관리</th>
                </tr>
              </thead>
              <tbody>
                {classList.map((item: ClassList) => (
                  <tr
                    className="border-b cursor-pointer hover:bg-gray-50"
                    key={item.id}
                    onClick={() =>
                      router.push(`/professor/class/list/${item.id}`)
                    }
                  >
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.course.code}
                    </td>
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.course.title}
                    </td>
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.group_name}
                    </td>
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.year}
                    </td>
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.quarter}
                    </td>

                    <td className="flex items-center p-4 space-x-2 ">
                      <IoAlertCircleOutline
                        className="text-lg cursor-pointer lg:text-xl hover:text-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/professor/class/enrollannouncement/${item.id}`,
                          );
                        }}
                      />
                      <RiUserAddLine
                        className="text-lg cursor-pointer lg:text-xl hover:text-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/professor/class/enrolluser/${item.id}`);
                        }}
                      />
                      <TbEdit
                        className="text-lg cursor-pointer lg:text-xl hover:text-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/professor/class/edit/${item.id}`);
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
            <Link href="/professor/class/post">
              <button
                className="px-4 py-2 text-sm font-normal text-white bg-primary rounded-xl hover:bg-primaryButtonHover"
                type="submit"
              >
                분반 개설
              </button>
            </Link>
            <Link href="/professor/class/courselist?page=1">
              <button
                className="px-4 py-2 text-sm font-normal text-white bg-primary rounded-xl hover:bg-primaryButtonHover"
                type="submit"
              >
                개설 강의 목록
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
