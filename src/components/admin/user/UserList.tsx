'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { IoSearchSharp } from 'react-icons/io5';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getAllUser } from '@/services/accountAdmin/getUser';
import { TbEdit } from 'react-icons/tb';

export default function UserList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: userListData } = useQuery({
    queryKey: ['userListData'],
    queryFn: getAllUser,
  });

  const userList = userListData?.results;
  const matchingRole: { [key: string]: string } = {
    'Regular User': '학생',
    Professor: '교수',
    'Super Admin': '관리자',
  };

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;
  const pagesPerBlock = 5;

  const currentItems = userList
    ? userList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      )
    : [];

  const totalPages = userList ? Math.ceil(userList.length / itemsPerPage) : 1;

  const currentBlock = Math.ceil(currentPage / pagesPerBlock);
  const startPage = (currentBlock - 1) * pagesPerBlock + 1;
  const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  const changePage = (page: number) => {
    setCurrentPage(page);
    router.push(`/admin/user/list?page=${page}`);
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        {/* Header */}
        <section className="flex flex-col items-center justify-between px-0 md:flex-row md:px-16">
          <h1 className="mb-3 text-lg md:mb-0">유저 전체 목록</h1>
          <div className="flex items-center border-[1px] border-gray-300 rounded-lg px-3 py-2 w-[16rem] bg-white shadow-sm">
            <IoSearchSharp className="mr-2 text-lg text-gray-500" />
            <input
              className="w-full text-sm text-secondary placeholder:text-sm placeholder:font-normal focus:outline-none"
              type="text"
              placeholder="학번으로 검색해보세요"
            />
          </div>
        </section>

        <hr className="mt-5 border-t-2 border-gray-200" />

        {/* user List */}
        <section className="px-3 overflow-x-auto sm:px-16">
          <table className="w-full text-sm text-left border-b-2 table-auto">
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
              {currentItems.map((item: any) => (
                <tr
                  key={item.id}
                  className="border-b cursor-pointer hover:bg-gray-50"
                >
                  <td className="p-4 text-xs sm:text-sm">
                    {item.student_number}
                  </td>
                  <td className="p-4 text-xs sm:text-sm">{item.name}</td>
                  <td className="p-4 text-xs sm:text-sm">{item.username}</td>
                  <td className="p-4 text-xs sm:text-sm">
                    {' '}
                    {matchingRole[item.admin_type] || 'undefined'}
                  </td>
                  <td className="flex items-center p-4 space-x-2 text-xs sm:text-base">
                    <TbEdit className="text-lg cursor-pointer lg:text-xl" />
                    <FiTrash2 className="text-lg cursor-pointer lg:text-xl" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Pagination */}
        <section className="flex items-center justify-center w-full px-16 mt-4 sm:justify-end">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => changePage(Math.max(startPage - pagesPerBlock, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded-xl hover:bg-gray-300 disabled:opacity-50"
            >
              &lt;
            </button>
            <div className="flex space-x-1 font-normal">
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => changePage(page)}
                  className={`px-3 py-1 rounded-xl ${
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
              onClick={() =>
                changePage(Math.min(startPage + pagesPerBlock, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded-xl hover:bg-gray-300 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
