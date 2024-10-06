'use client';

import { useState } from 'react';
import { IoSearchSharp } from 'react-icons/io5';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';

export default function AnnouncementList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const itemsPerPage = 9;
  const pagesPerBlock = 5;

  const problemList = Array.from({ length: 60 }, (_, i) => ({
    id: i + 1,
    title: `공지사항 ${i + 1}`,
    time: `2024-09-13 12:0${i + 1}`,
  }));

  const totalPages = Math.ceil(problemList.length / itemsPerPage);
  const currentBlock = Math.ceil(currentPage / pagesPerBlock);
  const startPage = (currentBlock - 1) * pagesPerBlock + 1;
  const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  const currentItems = problemList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // 드롭다운을 토글하는 함수
  const toggleItemExpansion = (id: number) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter((itemId) => itemId !== id));
    } else {
      setExpandedItems([...expandedItems, id]);
    }
  };

  return (
    <main className="w-full lg:w-[75%]">
      {/* 공지 검색 */}
      <div className="flex items-center bg-white shadow-md rounded-2xl px-4">
        <IoSearchSharp className="text-gray-400 text-lg" />
        <input
          type="text"
          className="w-full py-3 pl-3 focus:outline-none placeholder:text-sm text-sm"
          placeholder="공지 제목을 입력하세요."
        />
      </div>
      {/* 공지 목록 */}
      <div className="mt-5 rounded-2xl border bg-white shadow-md text-sm text-gray-500">
        <div className="flex items-center rounded-t-2xl py-2 px-5 border-b bg-white text-gray-800">
          <span className="ml-[30%]">공지 제목</span>
          <span className="ml-auto mr-[25%]">시간</span>
        </div>
        {currentItems.map((item, index) => (
          <div key={item.id}>
            <div
              className={`flex items-center text-sm p-5 border-b border-gray-200 hover:bg-[#eeeff3] cursor-pointer ${
                index === currentItems.length - 1 ? 'border-none' : ''
              }`}
              onClick={() => toggleItemExpansion(item.id)} // 클릭 이벤트 추가
            >
              <span className="w-[60%] ml-[5%]">{item.title}</span>
              <span className="ml-auto w-[20%] ">{item.time}</span>
              <span className="ml-auto text-xl mr-[2%]">
                {expandedItems.includes(item.id) ? (
                  <IoChevronUp />
                ) : (
                  <IoChevronDown />
                )}
              </span>
            </div>

            {/* 드롭다운 내용 */}
            {expandedItems.includes(item.id) && (
              <div className="p-10 border-b">
                <p>이것은 공지사항의 내용입니다.</p>
                <p>세부 정보는 여기에서 확인할 수 있습니다.</p>
                <p>추가 안내 사항이 있을 수 있습니다.</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center mt-4 space-x-1">
        <button
          onClick={() => {
            const previousBlockStartPage = Math.max(
              startPage - pagesPerBlock,
              1,
            );
            setCurrentPage(previousBlockStartPage);
          }}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-white rounded-2xl shadow-md hover:bg-[#eeeff3]"
        >
          &lt;
        </button>

        <div className="flex space-x-1 font-normal">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`shadow-md px-3 py-1 rounded-2xl ${
                page === currentPage
                  ? 'bg-primary text-white hover:bg-primaryButtonHover'
                  : 'bg-white hover:bg-[#eeeff3]'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            const nextBlockStartPage = Math.min(endPage + 1, totalPages);
            setCurrentPage(nextBlockStartPage);
          }}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-white rounded-2xl shadow-md hover:bg-[#eeeff3]"
        >
          &gt;
        </button>
      </div>
    </main>
  );
}