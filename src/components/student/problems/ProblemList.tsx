'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getProblemListUser } from '@/services/problemUser/getProblemListUser';
import Skeleton from '@mui/material/Skeleton';
import { Select } from 'antd';
import { IoSearchSharp } from 'react-icons/io5';

const { Option } = Select;

export default function ProblemList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initialPage = Number(searchParams.get('page')) || 1;
  const initialCategory = searchParams.get('category') || null;
  const initialSolved = searchParams.get('solved') || null;
  const initialLevel = searchParams.get('level') || null;

  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory,
  );
  const [selectedSolved, setSelectedSolved] = useState<string | null>(
    initialSolved,
  );
  const [selectedLevel, setSelectedLevel] = useState<string | null>(
    initialLevel,
  );

  const pagesPerBlock = 5;

  const {
    data: problemListData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      'problemListData',
      currentPage,
      selectedCategory,
      selectedSolved,
      selectedLevel,
    ],
    queryFn: () =>
      getProblemListUser(
        currentPage,
        selectedCategory || undefined,
        selectedSolved || undefined,
        selectedLevel === '1'
          ? 'Low'
          : selectedLevel === '2'
            ? 'Mid'
            : selectedLevel === '3'
              ? 'High'
              : undefined,
      ),
  });

  useEffect(() => {
    const query = new URLSearchParams();
    query.set('page', currentPage.toString());
    if (selectedCategory) query.set('category', selectedCategory);
    if (selectedSolved) query.set('solved', selectedSolved);
    if (selectedLevel) query.set('level', selectedLevel);
    router.push(`${pathname}?${query.toString()}`);
    refetch();
  }, [
    currentPage,
    selectedCategory,
    selectedSolved,
    selectedLevel,
    router,
    refetch,
  ]);

  const problemList = problemListData?.data?.data || [];
  const totalPages = problemListData?.data?.total_count
    ? Math.ceil(problemListData.data.total_count / 15)
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

  const handleFilterChange = (
    key: 'category' | 'solved' | 'level',
    value: string | null,
  ) => {
    if (key === 'category') setSelectedCategory(value);
    if (key === 'solved') setSelectedSolved(value);
    if (key === 'level') setSelectedLevel(value);
    setCurrentPage(1);
  };

  const allTags = [
    '변수',
    '데이터 타입',
    '연산자',
    '조건문',
    '반복문',
    '배열',
    '함수',
    '포인터',
    '문자열',
    '구조체',
    '버퍼',
    '파일',
    '클래스',
    '정렬 알고리즘',
    '탐색 알고리즘',
    '동적 프로그래밍',
    '탐욕 알고리즘',
    '순회 알고리즘',
    '분할 정복 알고리즘',
    '백트래킹 알고리즘',
  ];

  return (
    <>
      <main className="w-full">
        {/* 문제 검색 */}
        <div className="flex items-center px-4 bg-white shadow-md rounded-xl">
          <IoSearchSharp className="text-lg text-gray-400" />
          <input
            type="text"
            className="w-full py-3 pl-3 text-sm focus:outline-none placeholder:text-sm"
            placeholder="문제 제목을 입력하세요.(현재 검색 기능은 개발 중입니다.)"
          />
        </div>
        {/* 필터 옵션 */}
        <section className="flex gap-4 mb-5 mt-5">
          <Select
            placeholder="문제 유형"
            value={selectedCategory}
            onChange={(value) => handleFilterChange('category', value)}
            className="custom-select w-1/3 shadow-md  "
            allowClear
          >
            {allTags.map((tag) => (
              <Option value={tag} key={tag}>
                {tag}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="난이도 선택"
            value={selectedLevel}
            onChange={(value) => handleFilterChange('level', value)}
            className="custom-select w-1/3 shadow-md  "
            allowClear
          >
            <Option value="1">Lv.1</Option>
            <Option value="2">Lv.2</Option>
            <Option value="3">Lv.3</Option>
          </Select>
          <Select
            placeholder="해결 여부"
            value={selectedSolved}
            onChange={(value) => handleFilterChange('solved', value)}
            className="custom-select w-1/3 shadow-md  "
            allowClear
          >
            <Option value="unsolved">안 푼 문제</Option>
            <Option value="solved">푼 문제</Option>
          </Select>
        </section>

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
          ) : problemList.length === 0 ? (
            <div className="text-center text-gray-500 py-5">
              등록된 문제가 없습니다.
            </div>
          ) : (
            problemList.map((problemItem: any) => (
              <Link href={`${pathname}/${problemItem.id}`} key={problemItem.id}>
                <div className="flex justify-between items-center text-sm py-5 px-5 border-b hover:bg-[#eeeff3] cursor-pointer">
                  <span className="w-[10%] text-green-500 font-bold  pl-2">
                    {problemItem.is_solved === true ? '✔' : ''}
                  </span>
                  <span className="w-[50%]">{problemItem.title}</span>
                  <span
                    className={`w-[10%] font-semibold ${
                      problemItem.difficulty === 'Low'
                        ? 'text-green-400'
                        : problemItem.difficulty === 'Mid'
                          ? 'text-sky-400'
                          : 'text-rose-400'
                    }`}
                  >
                    {problemItem.difficulty === 'Low'
                      ? 'Lv.1'
                      : problemItem.difficulty === 'Mid'
                        ? 'Lv.2'
                        : 'Lv.3'}
                  </span>
                  <span className="w-[10%]">
                    {problemItem.submission_number}
                  </span>
                  <span className="w-[10%]">
                    {problemItem.accuracy ?? 'N/A'}%
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
            className={`px-3 py-1 bg-white rounded-2xl shadow-md hover:bg-[#eeeff3] ${
              currentBlock === 1 ? 'opacity-40' : ''
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
            className={`px-3 py-1 bg-white rounded-2xl shadow-md hover:bg-[#eeeff3] ${
              currentBlock === 1 ? 'opacity-40' : ''
            }`}
          >
            &gt;
          </button>
        </div>
      </main>
    </>
  );
}
