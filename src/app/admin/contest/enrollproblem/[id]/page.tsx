'use client';

import { Checkbox, message, Modal } from 'antd';
import { PiExclamationMarkFill } from 'react-icons/pi';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IoSearchSharp } from 'react-icons/io5';
import Skeleton from '@mui/material/Skeleton';
import { getAllProblem } from '@/services/problemAdmin/getAllProblem';
import { enrollProblemsContest } from '@/services/contestAdmin/enrollProblemsContest';
import { getProblemsContest } from '@/services/contestAdmin/getProblemsContest';
import { deleteProblemsContest } from '@/services/contestAdmin/deleteProblemsContest';

export default function ProblemEnroll() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isProblemModalOpen, setIsProblemModalOpen] = useState<boolean>(false);
  const [selectedProblems, setSelectedProblems] = useState<Problem[]>([]);
  const [deleteSelectedProblems, setDeleteSelectedProblems] = useState<
    Problem[]
  >([]);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const contestId = Number(pathname.split('/').pop());
  const initialPage = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const pagesPerBlock = 5;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = Number(urlParams.get('page')) || 1;
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    if (isProblemModalOpen) {
      refetch();
    }
  }, [isProblemModalOpen]);

  const {
    data: problemListData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['problemListData', currentPage],
    queryFn: () => getAllProblem(currentPage),
  });

  const updateUrlAndPage = (page: number) => {
    window.history.pushState(
      null,
      '',
      `/admin/contest/enrollproblem/${contestId}?page=${page}`,
    );
    setCurrentPage(page);
  };

  const problems = problemListData?.data?.data || [];
  const totalPages = problemListData?.data?.total_count
    ? Math.ceil(problemListData.data.total_count / 15)
    : 1;

  const currentBlock = Math.ceil(currentPage / pagesPerBlock);
  const startPage = (currentBlock - 1) * pagesPerBlock + 1;
  const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);

  const changePage = (page: number) => {
    updateUrlAndPage(page);
  };

  const changePageBlock = (isNext: boolean) => {
    const newPage = isNext
      ? Math.min(endPage + 1, totalPages)
      : Math.max(startPage - pagesPerBlock, 1);
    changePage(newPage);
  };

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        ids: selectedProblems.map((problem) => problem.id),
      };
      return enrollProblemsContest(contestId, payload);
    },
    onSuccess: () => {
      message.success('문제 등록이 완료되었습니다.');
      setSelectedProblems([]);
      queryClient.invalidateQueries({
        queryKey: ['contestProblemsListData', contestId],
      });
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

  const onSubmit = () => {
    mutation.mutate();
  };

  const handleProblemSelection = (problem: Problem) => {
    setSelectedProblems((prev) =>
      prev.some((p) => p.id === problem.id)
        ? prev.filter((p) => p.id !== problem.id)
        : [...prev, problem],
    );
  };

  const { data: enrolledProblemsData, isLoading: enrolledProblemsIsLoading } =
    useQuery({
      queryKey: ['contestProblemsListData', contestId],
      queryFn: () => getProblemsContest(contestId),
    });

  const enrolledProblems = enrolledProblemsData?.data?.data || [];

  const handleProblemDeleteSelection = (problem: Problem) => {
    setDeleteSelectedProblems((prev) =>
      prev.some((p) => p.id === problem.id)
        ? prev.filter((p) => p.id !== problem.id)
        : [...prev, problem],
    );
  };

  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => {
      const payload = { ids };
      return deleteProblemsContest(contestId, payload);
    },
    onSuccess: () => {
      setDeleteSelectedProblems([]); // 선택된 문제 목록 초기화
      queryClient.invalidateQueries({
        queryKey: ['contestProblemsListData', contestId],
      });
      message.success('문제 삭제가 완료되었습니다.');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message;
      if (message === '로그인이 필요합니다.') {
        alert(message);
        router.push('/');
      } else {
        message.error(message || '오류가 발생했습니다.');
      }
    },
  });

  const handleDeleteSubmit = () => {
    const idsToDelete = deleteSelectedProblems.map(
      (problem) => problem.problem.id,
    );
    Modal.confirm({
      title: '정말 삭제하시겠습니까?',
      content: `선택된 ${idsToDelete.length}개의 문제를 삭제합니다. 이 작업은 되돌릴 수 없습니다.`,
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(idsToDelete);
        } catch (error: any) {
          message.error(
            error.response?.data?.message || '오류가 발생했습니다.',
          );
        }
      },
    });
  };

  return (
    <div className="flex flex-col  min-h-screen p-8 space-y-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <section className="flex flex-col sm:flex-row items-center px-16">
          <h1 className="text-lg">대회 문제 관리</h1>
        </section>
        <hr className="mt-5 border-t-2 border-gray-200" />

        <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
          <button
            onClick={() => setIsProblemModalOpen(true)}
            className="py-1.5 w-36 text-sm font-normal text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
          >
            문제 검색 및 목록
          </button>
        </div>

        {selectedProblems.length > 0 && (
          <div className="px-10 mt-4">
            <h3 className="mb-2 text-sm">선택된 문제(등록):</h3>
            <div className="flex flex-wrap gap-2 overflow-y-auto max-h-80">
              {selectedProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="flex items-center px-3 py-1 text-sm bg-gray-200 rounded-full"
                >
                  <span className="mr-2">
                    {problem.id} - {problem.title}
                  </span>
                  <button
                    className="text-red-500"
                    onClick={() =>
                      setSelectedProblems((prev) =>
                        prev.filter((p) => p.id !== problem.id),
                      )
                    }
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end w-full px-10 mt-8 space-x-3">
          <span className="flex items-center text-xs font-normal text-gray-400">
            <PiExclamationMarkFill className="text-lg" />
            <span>&nbsp; 문제 추가 후 등록 버튼을 눌러주세요.</span>
          </span>
          <button
            onClick={onSubmit}
            className={`px-4 py-2 text-base font-normal text-white rounded-xl ${
              selectedProblems.length > 0
                ? 'bg-primary hover:bg-primaryButtonHover'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={selectedProblems.length === 0}
          >
            문제 등록
          </button>
        </div>
      </div>

      <div className="w-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <div className="flex flex-col justify-center px-10 py-4 border-b-[1.5px] border-gray-200">
          <span className="text-lg px-6">등록된 문제 목록</span>
          <div className="overflow-auto max-h-80 border my-5">
            <table className="table-auto w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border-b">ID</th>
                  <th className="px-4 py-2 border-b">제목</th>
                  <th className="px-4 py-2 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {enrolledProblemsIsLoading ? (
                  Array.from({ length: 4 }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {Array.from({ length: 3 }).map((_, colIndex) => (
                        <td key={colIndex} className="p-4">
                          <Skeleton animation="wave" width="100%" height={20} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : enrolledProblems.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-500 py-4">
                      등록된 문제가 없습니다.
                    </td>
                  </tr>
                ) : (
                  enrolledProblems.map((problem: Problem) => (
                    <tr
                      key={problem.id}
                      className="hover:bg-gray-50"
                      onClick={() => handleProblemDeleteSelection(problem)}
                    >
                      <td className="px-4 py-2 border-b">
                        {problem.problem.id}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {problem.problem.title}
                      </td>
                      <td className="px-4 py-2 border-b text-center">
                        <Checkbox
                          checked={deleteSelectedProblems.some(
                            (p) => p.id === problem.id,
                          )}
                          onChange={() => handleProblemDeleteSelection(problem)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {deleteSelectedProblems.length > 0 && (
          <div className="px-10 mt-4">
            <h3 className="mb-2 text-sm">선택된 문제(삭제):</h3>
            <div className="flex flex-wrap gap-2 overflow-y-auto max-h-80">
              {deleteSelectedProblems.map((problem: Problem) => (
                <div
                  key={problem.problem.id}
                  className="flex items-center px-3 py-1 text-sm bg-gray-200 rounded-full"
                >
                  <span className="mr-2">
                    {problem.problem.id} - {problem.problem.title}
                  </span>
                  <button
                    className="text-red-500"
                    onClick={() =>
                      setDeleteSelectedProblems((prev) =>
                        prev.filter((p) => p.id !== problem.id),
                      )
                    }
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end w-full px-10 mt-8">
          <button
            onClick={handleDeleteSubmit}
            className={`px-4 py-2 text-base font-normal text-white rounded-xl ${
              deleteSelectedProblems.length > 0
                ? 'bg-primary hover:bg-primaryButtonHover'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={deleteSelectedProblems.length === 0}
          >
            문제 삭제
          </button>
        </div>
      </div>

      {isProblemModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-semibold text-gray-700"
          onClick={() => setIsProblemModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg w-[80%] sm:w-[50%] h-[90vh] p-8 overflow-hidden flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg mb-4">문제 검색 및 목록</h2>
            <button
              className="absolute right-10 top-7 text-xl"
              onClick={() => setIsProblemModalOpen(false)}
            >
              x
            </button>
            <div className="flex items-center mb-4 border-[1px] border-gray-300 rounded-lg px-3 py-2 w-full bg-white shadow-sm">
              <IoSearchSharp className="mr-2 text-lg text-gray-500" />
              <input
                className="w-full text-sm text-secondary placeholder:text-sm focus:outline-none"
                type="text"
                placeholder="제목으로 검색해보세요"
              />
            </div>

            <div className="flex-1 overflow-y-auto border-t mt-2">
              {isLoading ? (
                <table className="w-full text-sm text-left border-b-2 table-auto">
                  <thead>
                    <tr>
                      {Array.from({ length: 3 }).map((_, index) => (
                        <th key={index} className="p-4">
                          <Skeleton animation="wave" width="100%" height={30} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 15 }).map((_, rowIndex) => (
                      <tr key={rowIndex}>
                        {Array.from({ length: 3 }).map((_, colIndex) => (
                          <td key={colIndex} className="p-4">
                            <Skeleton
                              animation="wave"
                              width="100%"
                              height={20}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : problems.length === 0 ? (
                <p className="text-center mt-4">검색 결과가 없습니다.</p>
              ) : (
                problems.map((problem: Problem) => (
                  <div
                    key={problem.id}
                    className="flex items-center justify-between p-2 border-b cursor-pointer hover:bg-gray-50"
                    onClick={() => handleProblemSelection(problem)}
                  >
                    <span className="text-sm">{problem.id}</span>
                    <span className="text-sm">{problem.title}</span>

                    <Checkbox
                      checked={selectedProblems.some(
                        (p) => p.id === problem.id,
                      )}
                      onChange={() => handleProblemSelection(problem)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-center items-center mt-4 space-x-2">
              <button
                onClick={() => changePageBlock(false)}
                disabled={currentBlock === 1}
                className={`px-3 py-1 rounded-xl ${currentBlock === 1 ? 'bg-gray-200 opacity-50' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                &lt;
              </button>
              {Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i,
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => changePage(page)}
                  className={`px-3 py-1 rounded-xl ${page === currentPage ? 'bg-primary text-white hover:bg-primaryButtonHover' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => changePageBlock(true)}
                disabled={endPage === totalPages}
                className={`px-3 py-1 rounded-xl ${endPage === totalPages ? 'bg-gray-200 opacity-50' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
