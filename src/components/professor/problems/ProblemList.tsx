'use client';

import { useState, useEffect, useRef } from 'react';
import { FiTrash2 } from 'react-icons/fi';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { TbEdit } from 'react-icons/tb';
import Skeleton from '@mui/material/Skeleton';
import { Button, Modal, Upload, message } from 'antd';
import { getAllProblem } from '@/services/problemAdmin/getAllProblem';
import { deleteProblem } from '@/services/problemAdmin/deleteProblem';
import { MdChecklist } from 'react-icons/md';
import { UploadOutlined } from '@ant-design/icons';
import { postTestcase } from '@/services/problemAdmin/postTestcase';
import CircularProgress from '@mui/material/CircularProgress';
import { GoCodescan } from 'react-icons/go';
import Link from 'next/link';
import { IoSearchSharp } from 'react-icons/io5';
import { Select } from 'antd';

const { Option } = Select;

export default function ProblemList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [isTestCaseUploadModalOpen, setIsTestCaseUploadModalOpen] =
    useState<boolean>(false);
  const [selectTestcaseId, setIsSelectTestcaseId] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isMuteLoading, setIsMutateLoading] = useState(false);
  const pagesPerBlock = 5;

  const initialKeyword = searchParams.get('keyword') || null;
  const initialType = searchParams.get('type') || null;
  const initialLanguage = searchParams.get('language') || null;
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = useState<string | null>(initialType);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
    initialLanguage,
  );
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(
    initialKeyword,
  );

  const {
    data: problemListData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      'problemListData',
      ,
      currentPage,
      selectedType,
      selectedLanguage,
      selectedKeyword,
    ],
    queryFn: () =>
      getAllProblem(
        currentPage,
        selectedKeyword || undefined,
        selectedType || undefined,
        selectedLanguage || undefined,
      ),
  });

  const handleFilterChange = (
    key: 'keyword' | 'language' | 'type',
    value: string | null,
  ) => {
    if (key === 'keyword') setSelectedKeyword(value);
    if (key === 'type') setSelectedType(value);
    if (key === 'language') setSelectedLanguage(value);

    setCurrentPage(1);
  };

  const handleSearch = () => {
    const searchValue = searchInputRef.current?.value || '';
    handleFilterChange('keyword', searchValue);
  };

  useEffect(() => {
    const query = new URLSearchParams();
    query.set('page', currentPage.toString());
    if (selectedKeyword) query.set('keyword', selectedKeyword);
    if (selectedType) query.set('type', selectedType);
    if (selectedLanguage) query.set('language', selectedLanguage);

    router.push(`/professor/problems/list?${query.toString()}`);
    refetch();
  }, [
    currentPage,
    router,
    refetch,
    selectedType,
    selectedLanguage,
    selectedKeyword,
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

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProblem(id),
    onSuccess: () => {
      message.success('문제가 성공적으로 삭제되었습니다.');
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

  const testcaseMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      postTestcase(id, data),
    onMutate: () => {
      setIsMutateLoading(true);
      setIsTestCaseUploadModalOpen(false);
    },
    onSuccess: () => {
      message.success('테스트케이스가 성공적으로 등록되었습니다.');
      refetch();
    },
    onError: (error: any) => {
      if (error.response?.data?.message === '로그인이 필요합니다.') {
        alert(error.response?.data?.message);
        router.push('/');
      } else {
        message.error('등록 중 오류가 발생했습니다. 파일을 확인해주세요.');
      }
    },
    onSettled: () => {
      setIsMutateLoading(false);
      setIsTestCaseUploadModalOpen(false);
      setSelectedFile(null);
      setIsSelectTestcaseId(0); // 선택된 문제 초기화
    },
  });

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
  };

  // 테스트케이스 업로드 핸들러
  const handleTestcaseUpload = async (id: number) => {
    if (!selectedFile) {
      message.error('테스트케이스 파일을 선택하세요.');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('spj', 'false'); // `spj`는 기본값 false

    testcaseMutation.mutate({ id, data: formData });
  };

  // 모달 닫기 핸들러
  const closeModal = () => {
    setIsTestCaseUploadModalOpen(false);
    setSelectedFile(null); // 파일 초기화
    setIsSelectTestcaseId(0); // 선택된 문제 초기화
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <section className="flex flex-col items-center justify-between px-0 md:flex-row md:px-16">
          <h1 className="mb-3 text-lg md:mb-0">문제 목록</h1>
          <div className="flex items-center gap-2">
            <Select
              placeholder="문제타입"
              value={selectedType}
              onChange={(value) => handleFilterChange('type', value)}
              className="w-28"
              allowClear
            >
              <Option value={'public'}>공통</Option>
              <Option value={'other'}>대회/과제</Option>
            </Select>

            <Select
              placeholder="언어"
              value={selectedLanguage}
              onChange={(value) => handleFilterChange('language', value)}
              className="w-28"
              allowClear
            >
              <Option value={'C'}>C</Option>
              <Option value={'C++'}>C++</Option>
              <Option value={'Java'}>Java</Option>
              <Option value={'Python3'}>Python3</Option>
              <Option value={'Rust'}>Rust</Option>
            </Select>

            <div className="flex items-center border-[1px] border-gray-300 rounded-lg px-3 py-2 w-[16rem] bg-white shadow-sm">
              <IoSearchSharp
                className="mr-2 text-lg text-gray-500"
                onClick={() => handleSearch()}
              />
              <input
                className="w-full text-sm text-secondary placeholder:text-sm placeholder:font-normal focus:outline-none"
                type="text"
                placeholder="문제를 검색해보세요"
                ref={searchInputRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleFilterChange('keyword', e.currentTarget.value);
                  }
                }}
              />
            </div>
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
          ) : problemList.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 py-4">
                등록된 문제가 없습니다.
              </td>
            </tr>
          ) : (
            <table
              className="w-full text-sm text-left border-b-2 table-auto"
              style={{ tableLayout: 'fixed' }}
            >
              <thead>
                <tr className="border-b-2">
                  <th className="p-4">제목</th>
                  <th className="p-4">공개여부</th>
                  <th className="p-4">문제타입</th>
                  <th className="p-4">출제자</th>
                  <th className="p-4">테스트케이스</th>
                  <th className="p-4">문제 관리</th>
                </tr>
              </thead>
              <tbody>
                {problemList.map((item: ProblemList) => (
                  <tr
                    className="border-b cursor-pointer hover:bg-gray-50"
                    key={item.id}
                    onClick={() =>
                      router.push(`/professor/problems/list/${item.id}`)
                    }
                  >
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.title}
                    </td>
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.is_visible ? '공개' : '비공개'}
                    </td>
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.is_public ? '공통' : '대회/과제'}
                    </td>
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item?.created_by?.name}
                    </td>
                    <td className="p-4 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.test_case_id ? '등록' : '미등록'}
                    </td>
                    <td className="flex items-center p-4 space-x-2 text-xs sm:text-base">
                      <GoCodescan
                        className="text-base cursor-pointer lg:text-lg hover:text-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/professor/problems/submission/${item.id}?page=1`,
                          );
                        }}
                      />
                      <MdChecklist
                        className="text-lg cursor-pointer lg:text-xl hover:text-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsTestCaseUploadModalOpen(true);
                          setIsSelectTestcaseId(item.id);
                        }}
                      />

                      <TbEdit
                        className="text-lg cursor-pointer lg:text-xl hover:text-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/professor/problems/edit/${item.id}`);
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

        <section className="flex items-center w-full px-3 sm:px-16 mt-4 justify-between">
          <Link href="/professor/problems/post">
            <button
              className="px-4 py-2 text-sm font-normal text-white bg-primary rounded-xl hover:bg-primaryButtonHover"
              type="submit"
            >
              문제 등록
            </button>
          </Link>
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
      {isTestCaseUploadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="relative w-[90%] max-w-md bg-white rounded-lg shadow-lg p-6 md:p-8 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                테스트케이스 업로드
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={closeModal}
              >
                <span className="text-xl font-bold">&times;</span>
              </button>
            </div>

            {/* 파일 업로드 */}
            <Upload
              accept=".zip"
              beforeUpload={(file) => {
                handleFileChange(file);
                return false; // 자동 업로드 방지
              }}
              showUploadList={false}
            >
              <Button
                icon={<UploadOutlined />}
                className="w-full py-2 px-4 bg-gray-100 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
              >
                테스트케이스.zip 업로드
              </Button>
            </Upload>

            {/* 선택된 파일 이름 */}
            {selectedFile && (
              <div className="mt-4 text-md text-gray-700">
                <span className="font-medium">선택된 파일:</span>{' '}
                {selectedFile.name}
              </div>
            )}

            {/* 등록 버튼 */}
            <div className="mt-6 flex justify-end">
              <button
                className="py-2 px-4 bg-primary text-white font-medium rounded-md hover:bg-primaryButtonHover transition-all"
                onClick={() => handleTestcaseUpload(selectTestcaseId)}
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}
      {isMuteLoading && (
        <div
          className="fixed inset-0 z-50 flex flex-col space-y-4 items-center justify-center bg-black bg-opacity-50"
          style={{ color: 'white' }}
        >
          <CircularProgress color="inherit" />
          <span className="text-lg">업로드 중 입니다.</span>
        </div>
      )}
    </div>
  );
}
