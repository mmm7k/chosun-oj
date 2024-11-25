'use client';

import { useState, useEffect, useRef } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { IoSearchSharp } from 'react-icons/io5';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getAllUser } from '@/services/accountAdmin/getAllUser';
import { TbEdit } from 'react-icons/tb';
import Skeleton from '@mui/material/Skeleton';
import { deleteUser } from '@/services/accountAdmin/deleteUser';
import { Modal, message } from 'antd';

export default function UserList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const pagesPerBlock = 5;
  const initialUser = searchParams.get('user') || null;
  const [selectedUser, setSelectedUser] = useState<string | null>(initialUser);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleFilterChange = (key: 'user', value: string | null) => {
    if (key === 'user') setSelectedUser(value);
    setCurrentPage(1);
  };
  const handleSearch = () => {
    const searchValue = searchInputRef.current?.value || '';
    handleFilterChange('user', searchValue);
  };

  const {
    data: userListData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['userListData', currentPage, selectedUser],
    queryFn: () => getAllUser(currentPage, selectedUser || undefined),
  });

  useEffect(() => {
    const query = new URLSearchParams();
    query.set('page', currentPage.toString());
    if (selectedUser) query.set('user', selectedUser);
    router.push(`/admin/user/list?${query.toString()}`);
    refetch();
  }, [currentPage, router, refetch, selectedUser]);

  const userList = userListData?.data?.data || [];
  const totalPages = userListData?.data?.total_count
    ? Math.ceil(userListData.data.total_count / 15)
    : 1;

  const matchingRole: { [key: string]: string } = {
    'Regular User': '학생',
    Professor: '교수',
    'Super Admin': '관리자',
  };

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

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      message.success('유저가 성공적으로 삭제되었습니다.');
      refetch();
    },
    onError: (error: any) => {
      if (error.response?.data?.message === '로그인이 필요합니다.') {
        alert(error.response?.data?.message);
        router.push('/');
      } else {
        message.error(
          error.response?.data?.message || '삭제 중 오류가 발생했습니다.',
        );
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
        deleteMutation.mutate(id); // 삭제 뮤테이션 호출
      },
    });
  };
  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <section className="flex flex-col items-center justify-between px-0 md:flex-row md:px-16">
          <h1 className="mb-3 text-lg md:mb-0">유저 전체 목록</h1>
          <div className="flex items-center border-[1px] border-gray-300 rounded-lg px-3 py-2 w-[16rem] bg-white shadow-sm">
            <IoSearchSharp
              className="mr-2 text-lg text-gray-500 cursor-pointer"
              onClick={() => handleSearch()}
            />
            <input
              className="w-full text-sm text-secondary placeholder:text-sm placeholder:font-normal focus:outline-none"
              type="text"
              placeholder="이름으로 검색하세요."
              ref={searchInputRef}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleFilterChange('user', e.currentTarget.value);
                }
              }}
            />
          </div>
        </section>

        <hr className="mt-5 border-t-2 border-gray-200" />

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
          ) : userList.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 py-4">
                등록된 유저가 없습니다.
              </td>
            </tr>
          ) : (
            <table
              className="w-full text-sm text-left border-b-2 table-auto"
              style={{ tableLayout: 'fixed' }}
            >
              <thead>
                <tr className="border-b-2">
                  <th className="p-4">학번</th>
                  <th className="p-4">이름</th>
                  <th className="p-4">아이디</th>
                  <th className="p-4">권한</th>
                  <th className="p-4">유저 관리</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((item: UserList) => (
                  <tr
                    className="border-b cursor-pointer hover:bg-gray-50"
                    key={item.id}
                    onClick={() => router.push(`/admin/user/list/${item.id}`)}
                  >
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.student_number}
                    </td>
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.username}
                    </td>
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {matchingRole[item.admin_type] || 'undefined'}
                    </td>
                    <td className="flex items-center p-4 space-x-2 text-xs sm:text-base">
                      <TbEdit
                        className="text-lg cursor-pointer lg:text-xl hover:text-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/user/edit/${item.id}`);
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
