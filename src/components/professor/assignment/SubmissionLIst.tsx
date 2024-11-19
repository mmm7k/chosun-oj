'use client';

import { Select } from 'antd';
import { useState, useEffect } from 'react';
import { IoSearchSharp } from 'react-icons/io5';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import 'highlight.js/styles/github.css';

const { Option } = Select;

export default function SubmissionList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openSubmissionId, setOpenSubmissionId] = useState<number | null>(null);

  const pageParam = searchParams.get('page') || '1';
  const courseParam = searchParams.get('course') || null;

  const [currentPage, setCurrentPage] = useState<number>(parseInt(pageParam));
  const [selectedCourse, setSelectedCourse] = useState<string | null>(
    courseParam,
  );

  const courses = [
    '기초프로그래밍 중간고사',
    '심화프로그래밍 중간고사',
    '알고리즘 대회',
  ];

  const generateRandomIP = () =>
    `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(
      Math.random() * 256,
    )}.${Math.floor(Math.random() * 256)}`;

  const submissions = Array.from({ length: 60 }, (_, i) => ({
    id: i + 1,
    studentId: `2023${String(i + 1).padStart(3, '0')}`,
    studentName: `학생${i + 1}`,
    problemName: `문제 ${i + 1}`,
    submissionTime: `2024-9-2 16:19:${i + 1}`,
    isSuccess: Math.random() > 0.5,
    course: courses[Math.floor(Math.random() * courses.length)],
    language: 'C',
    ip: generateRandomIP(),
    code: `function solution(s) {
let t = s.split(" ");
return Math.min(...t) + " " + Math.max(...t);
}`,
  }));

  const itemsPerPage = 15;
  const pagesPerBlock = 5;

  const filteredList = submissions.filter(
    (item) => selectedCourse && item.course === selectedCourse,
  );

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
    updateQueryParams(page, selectedCourse);
  };

  const updateQueryParams = (page: number, course: string | null) => {
    const query = new URLSearchParams();
    if (course) query.set('course', course);
    query.set('page', page.toString());
    router.push(`/professor/assignment/submission?${query.toString()}`);
  };

  const toggleSubmission = (id: number) => {
    setOpenSubmissionId(openSubmissionId === id ? null : id);
  };

  const handleCourseChange = (value: string | null) => {
    setSelectedCourse(value);
    setCurrentPage(1);
    updateQueryParams(1, value);
  };

  useEffect(() => {
    setCurrentPage(parseInt(pageParam));
    setSelectedCourse(courseParam);
  }, [pageParam, courseParam]);

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        {!selectedCourse ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <h1 className="text-xl">💡 과목을 선택하세요</h1>
            <Select
              placeholder="과목을 선택하세요."
              className="w-64"
              onChange={handleCourseChange}
            >
              {courses.map((course) => (
                <Option key={course} value={course}>
                  {course}
                </Option>
              ))}
            </Select>
          </div>
        ) : (
          <>
            <section className="flex flex-col items-center justify-between px-0 md:flex-row md:px-16">
              <h1 className="mb-3 text-lg md:mb-0">과제 제출 목록</h1>
              <div className="flex flex-col items-center space-x-4 space-y-3 md:flex-row md:space-y-0">
                <Select
                  value={selectedCourse}
                  onChange={handleCourseChange}
                  className="w-44"
                >
                  {courses.map((course) => (
                    <Option key={course} value={course}>
                      {course}
                    </Option>
                  ))}
                </Select>
                <div className="flex items-center border-[1px] border-gray-300 rounded-lg px-3 py-2 w-[16rem] bg-white shadow-sm">
                  <IoSearchSharp className="mr-2 text-lg text-gray-500" />
                  <input
                    className="w-full text-sm text-secondary placeholder:text-sm placeholder:font-normal focus:outline-none"
                    type="text"
                    placeholder="문제를 검색해보세요"
                  />
                </div>
              </div>
            </section>

            <hr className="mt-5 border-t-2 border-gray-200" />

            <section className="px-3 overflow-x-auto sm:px-16">
              <table className="w-full text-sm text-left border-b-2 table-auto">
                <thead>
                  <tr className="border-b-2">
                    <th className="p-4">학번</th>
                    <th className="p-4">이름</th>
                    <th className="p-4">문제</th>
                    <th className="p-4">언어</th>
                    <th className="p-4">IP</th>
                    <th className="p-4">결과</th>
                    <th className="p-4">제출 시간</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <>
                      <tr
                        key={item.id}
                        className="relative border-b cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleSubmission(item.id)}
                      >
                        <td className="p-4">{item.studentId}</td>
                        <td className="p-4">{item.studentName}</td>
                        <td className="p-4">{item.problemName}</td>
                        <td className="p-4">{item.language}</td>
                        <td className="p-4">{item.ip}</td>
                        <td className="p-4">
                          {item.isSuccess ? (
                            <FiCheckCircle className="text-green-500" />
                          ) : (
                            <FiXCircle className="text-red-500" />
                          )}
                        </td>
                        <td className="p-4">{item.submissionTime}</td>

                        <div className="absolute -translate-y-1/2 right-4 top-1/2">
                          {openSubmissionId === item.id ? (
                            <RiArrowDropUpLine className="text-2xl" />
                          ) : (
                            <RiArrowDropDownLine className="text-2xl" />
                          )}
                        </div>
                      </tr>

                      {openSubmissionId === item.id && (
                        <tr>
                          <td colSpan={7} className="px-4 py-2 text-left">
                            <pre className="bg-[#1E1E1E] text-[#D4D4D4] p-2">
                              <code>{item.code}</code>
                            </pre>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="flex items-center justify-center w-full px-16 mt-4 sm:justify-end">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() =>
                    changePage(Math.max(startPage - pagesPerBlock, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded-xl hover:bg-gray-300 disabled:opacity-50"
                >
                  &lt;
                </button>
                {pages.map((page) => (
                  <button
                    key={page}
                    onClick={() => changePage(page)}
                    className={`px-3 py-1 rounded-xl ${
                      page === currentPage
                        ? 'bg-primary text-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
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
          </>
        )}
      </div>
    </div>
  );
}
