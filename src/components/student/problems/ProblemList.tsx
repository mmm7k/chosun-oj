'use client';

import { Select } from 'antd';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoSearchSharp } from 'react-icons/io5';

const { Option } = Select;

export default function ProblemList() {
  const [selectedSolved, setSelectedSolved] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(
    null,
  );
  const [selectedAccuracy, setSelectedAccuracy] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [problemList, setProblemList] = useState<any[]>([]);

  const itemsPerPage = 20;
  const pagesPerBlock = 5;

  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('category') || 'all';
  const pageParam = searchParams.get('page') || '1';
  const solvedParam = searchParams.get('solved') || null;
  const levelParam = searchParams.get('level') || null;
  const submissionParam = searchParams.get('submission') || null;
  const accuracyParam = searchParams.get('accuracy') || null;

  const pathname = usePathname();

  useEffect(() => {
    const generateRandomList = () => {
      return Array.from({ length: 120 }, (_, i) => {
        const randomLevel = Math.floor(Math.random() * 3) + 1;
        const randomSolved = Math.random() > 0.5 ? 'solved' : 'unsolved';
        const randomSubmission = Math.floor(Math.random() * 100) + 1;
        const randomAccuracy = Math.floor(Math.random() * 101);

        return {
          id: i + 1,
          name: `피라미드 별찍기${i + 1}`,
          level: `Lv.${randomLevel}`,
          solved: randomSolved,
          submissionCount: randomSubmission,
          accuracyRate: randomAccuracy,
        };
      });
    };

    setProblemList(generateRandomList());
  }, []);

  useEffect(() => {
    setSelectedSolved(solvedParam);
    setSelectedLevel(levelParam);
    setSelectedSubmission(submissionParam);
    setSelectedAccuracy(accuracyParam);
    setCurrentPage(parseInt(pageParam));
  }, [solvedParam, levelParam, submissionParam, accuracyParam, pageParam]);

  const updateQueryParams = (
    page: number,
    solved: string | null,
    level: string | null,
    submission: string | null,
    accuracy: string | null,
  ) => {
    const query = new URLSearchParams();
    query.set('category', categoryParam);
    query.set('page', page.toString());
    if (solved) query.set('solved', solved);
    if (level) query.set('level', level);
    if (submission) query.set('submission', submission);
    if (accuracy) query.set('accuracy', accuracy);
    router.push(`${pathname}?${query.toString()}`);
  };

  let filteredList = problemList
    .filter((item) => (selectedSolved ? item.solved === selectedSolved : true))
    .filter((item) =>
      selectedLevel ? item.level === `Lv.${selectedLevel}` : true,
    );

  if (selectedSubmission) {
    filteredList = filteredList.sort((a, b) =>
      selectedSubmission === 'ascending'
        ? a.submissionCount - b.submissionCount
        : b.submissionCount - a.submissionCount,
    );
  }

  if (selectedAccuracy) {
    filteredList = filteredList.sort((a, b) =>
      selectedAccuracy === 'ascending'
        ? a.accuracyRate - b.accuracyRate
        : b.accuracyRate - a.accuracyRate,
    );
  }

  const currentItems = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const currentBlock = Math.ceil(currentPage / pagesPerBlock);
  const startPage = (currentBlock - 1) * pagesPerBlock + 1;
  const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  const changePage = (page: number) => {
    setCurrentPage(page);
    updateQueryParams(
      page,
      selectedSolved,
      selectedLevel,
      selectedSubmission,
      selectedAccuracy,
    );
  };

  const handleFilterChange = (
    key: 'solved' | 'level' | 'submission' | 'accuracy',
    value: string | null,
  ) => {
    setCurrentPage(1);
    if (key === 'solved') setSelectedSolved(value);
    if (key === 'level') setSelectedLevel(value);
    if (key === 'submission') setSelectedSubmission(value);
    if (key === 'accuracy') setSelectedAccuracy(value);
    updateQueryParams(
      1,
      key === 'solved' ? value : selectedSolved,
      key === 'level' ? value : selectedLevel,
      key === 'submission' ? value : selectedSubmission,
      key === 'accuracy' ? value : selectedAccuracy,
    );
  };

  return (
    <>
      <main className="w-full lg:w-[75%]">
        {/* 문제 검색 */}
        <div className="flex items-center px-4 bg-white shadow-md rounded-2xl">
          <IoSearchSharp className="text-lg text-gray-400" />
          <input
            type="text"
            className="w-full py-3 pl-3 text-sm focus:outline-none placeholder:text-sm"
            placeholder="문제 제목을 입력하세요."
          />
        </div>
        {/* 문제 필터 */}
        <section className="flex gap-4 mt-3 overflow-auto overflow-y-hidden no-scrollbar">
          <div className="w-full h-9">
            <Select
              id="solved-select"
              placeholder="상태를 선택하세요."
              value={selectedSolved}
              onChange={(value) => handleFilterChange('solved', value)}
              className="w-full h-[85%] shadow-md custom-select rounded-xl"
              allowClear
            >
              <Option value="unsolved">안 푼 문제</Option>
              <Option value="solved">푼 문제</Option>
            </Select>
          </div>
          <div className="w-full h-9">
            <Select
              id="level-select"
              placeholder="난이도를 선택하세요."
              value={selectedLevel}
              onChange={(value) => handleFilterChange('level', value)}
              className="w-full h-[85%] shadow-md custom-select rounded-xl"
              allowClear
            >
              <Option value="1">Lv.1</Option>
              <Option value="2">Lv.2</Option>
              <Option value="3">Lv.3</Option>
            </Select>
          </div>
          {/* <div className="w-full h-9">
            <Select
              id="submission-select"
              placeholder="제출 인원"
              value={selectedSubmission}
              onChange={(value) => handleFilterChange('submission', value)}
              className="w-full h-[85%] shadow-md custom-select rounded-xl"
              allowClear
            >
              <Option value="ascending">제출 인원 오름차순</Option>
              <Option value="descending">제출 인원 내림차순</Option>
            </Select>
          </div>
          <div className="w-full h-9">
            <Select
              id="accuracy-select"
              placeholder="정답률"
              value={selectedAccuracy}
              onChange={(value) => handleFilterChange('accuracy', value)}
              className="w-full h-[85%] shadow-md custom-select rounded-xl"
              allowClear
            >
              <Option value="ascending">정답률 오름차순</Option>
              <Option value="descending">정답률 내림차순</Option>
            </Select>
          </div> */}
        </section>
        {/* 문제 목록 */}
        <div className="mt-5 text-sm text-gray-500 bg-white border shadow-md rounded-2xl">
          <div className="flex justify-between items-center rounded-t-2xl py-2 px-5 border-b bg-[#eeeff3] text-gray-800">
            <span className="w-[10%]">상태</span>
            <span className="w-[50%]">문제 이름</span>
            <span className="w-[10%]">난이도</span>
            <span className="w-[10%]">제출</span>
            <span className="w-[10%]">정답률</span>
          </div>
          {currentItems.map((item) => (
            <Link href={`/student/problems/${item.id}`} key={item.id}>
              <div className="flex justify-between items-center text-sm py-5 px-5 border-b hover:bg-[#eeeff3] cursor-pointer">
                <span className="w-[10%] text-green-500 font-bold">
                  {item.solved === 'solved' ? '✔' : ''}
                </span>
                <span className="w-[50%]">{item.name}</span>
                <span
                  className={`w-[10%] font-semibold ${
                    item.level === 'Lv.1'
                      ? 'text-green-400'
                      : item.level === 'Lv.2'
                        ? 'text-sky-400'
                        : 'text-rose-400'
                  }`}
                >
                  {item.level}
                </span>
                <span className="w-[10%]">{item.submissionCount}명</span>
                <span className="w-[10%]">{item.accuracyRate}%</span>
              </div>
            </Link>
          ))}
        </div>
        {/* 페이지네이션 */}
        <div className="flex items-center justify-center mt-16 space-x-1">
          <button
            onClick={() => changePage(Math.max(startPage - pagesPerBlock, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-white rounded-2xl shadow-md hover:bg-[#eeeff3]"
          >
            &lt;
          </button>

          <div className="flex space-x-1 font-normal">
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => changePage(page)}
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
            onClick={() =>
              changePage(Math.min(startPage + pagesPerBlock, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-white rounded-2xl shadow-md hover:bg-[#eeeff3]"
          >
            &gt;
          </button>
        </div>
      </main>
    </>
  );
}
