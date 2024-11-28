'use client';

import { useEffect, useMemo, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import Image from 'next/image';
import Split from 'react-split';
import { message, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import 'xterm/css/xterm.css';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useRouter, useSearchParams } from 'next/navigation';
import 'highlight.js/styles/github.css';
import { Select } from 'antd';
import axios from 'axios';
import { Buffer } from 'buffer';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getContestProblemDetailUser } from '@/services/contestUser/getContestProblemDetailUser';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';
import CircularProgress from '@mui/material/CircularProgress';
import { formattedDate } from '@/utils/dateFormatter';
import { postContestSubmission } from '@/services/contestUser/postContestSubmission';
import { getContestAllSubmissionUser } from '@/services/contestUser/getContestAllSubmissionUser';
import Link from 'next/link';
import { getServerStatus } from '@/services/problemUser/getServerStatus';

const { Option } = Select;

const codeTemplate = {
  c: `#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`,
  python: `def solution():\n    # Your code here\n    pass`,
  java: `public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`,
  rust: 'fn main() {\n    // Your code here\n}',
};

const languageMap: { [key: string]: string } = {
  C: 'c',
  'C++': 'cpp',
  Python3: 'python',
  Java: 'java',
  Rust: 'rust',
};

export default function Problem({
  params,
}: {
  params: { contestid: string; problemid: string };
}) {
  const contestId = parseInt(params.contestid);
  const problemId = parseInt(params.problemid);
  const [code, setCode] = useState('언어를 선택해주세요.');
  const [output, setOutput] = useState('실행 결과가 표시됩니다.');
  const [isLoading, setIsLoading] = useState(false);
  const [isLeftVisible, setIsLeftVisible] = useState(true);
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTestCaseModalVisible, setIsTestCaseModalVisible] = useState(false);
  const [isSubmitVisible, setIsSubmitVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState('');
  const [submitMemory, setSubmitMemory] = useState('');
  const [submitTime, setSubmitTime] = useState('');
  const [testCase, setTestCase] = useState('');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    number | null
  >(null);
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const pagesPerBlock = 5;

  // 저지 서버 상태
  const { data: serverStatusData, isLoading: isServerStatusLoading } = useQuery(
    {
      queryKey: ['serverStatusData'],
      queryFn: () => getServerStatus(),
    },
  );

  let serverStatus;
  if (serverStatusData?.error) {
    // 에러 처리
    serverStatus = 'abnormal';
  } else {
    // 정상적인 데이터 처리
    serverStatus = serverStatusData?.data?.servers[0]?.status || 'abnormal';
  }
  //에디터 커서 위치 테스트
  const [isFontReady, setIsFontReady] = useState(false); //폰트 로드 확인
  // 폰트 로드 확인
  useEffect(() => {
    document.fonts.ready.then(() => {
      setIsFontReady(true);
    });
  }, []);

  const toggleSubmissionCode = (submissionId: number) => {
    // 동일한 ID를 클릭한 경우 닫기
    if (selectedSubmissionId === submissionId) {
      setSelectedSubmissionId(null);
    } else {
      setSelectedSubmissionId(submissionId);
    }
  };

  //제출내역
  const { data: submissionListData, refetch } = useQuery({
    queryKey: ['submissionListData', contestId, problemId],
    queryFn: () =>
      getContestAllSubmissionUser(currentPage, contestId, problemId),
  });

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

  useEffect(() => {
    router.replace(
      `/student/contest/${contestId}/${problemId}?page=${currentPage}`,
    );
    refetch();
  }, [currentPage, router, refetch]);

  useEffect(() => {
    if (isLeftVisible) {
      setCurrentPage(1);
      router.replace(`/student/contest/${contestId}/${problemId}`);
    }
  }, [isLeftVisible, contestId, problemId, router]);

  const { data: contestProblemData, isError } = useQuery({
    queryKey: ['contestProblemData', contestId, problemId],
    queryFn: () => getContestProblemDetailUser(contestId, problemId),
  });

  if (isError) {
    alert('문제를 불러오는 중 오류가 발생했습니다.');
    router.push('/student');
  }
  const problemData = contestProblemData?.data?.problem || {};
  const [isViewerReady, setIsViewerReady] = useState(false);

  useEffect(() => {
    if (problemData.description) {
      setIsViewerReady(true);
    }
  }, [problemData.description]);
  // 불러온 사용 언어에서 셀렉트 옵션 생성
  const availableLanguages = useMemo(() => {
    return problemData.languages || []; // problemData.languages 그대로 사용
  }, [problemData.languages]);

  //코드실행
  const runcode = async () => {
    setIsLoading(true);
    let language = '';
    switch (selectedLanguage) {
      case 'C':
        language = '49';
        break;
      case 'C++':
        language = '54';
        break;
      case 'Python3':
        language = '71';
        break;
      case 'Java':
        language = '62';
        break;
      case 'Rust':
        language = '73';
        break;
      default:
        language = '';
    }
    try {
      const encodedSourceCode = Buffer.from(code, 'utf-8').toString('base64');
      const encodedStdin = Buffer.from(testCase).toString('base64');
      const response = await axios.post(
        'http://chosuncnl.shop:2358/submissions?base64_encoded=true&wait=true',
        {
          source_code: encodedSourceCode,
          language_id: language,
          stdin: encodedStdin,
          compiler_options: '',
          command_line_arguments: '',
          redirect_stderr_to_stdout: true,
        },
      );
      const token = response.data.token;

      // 두 번째 GET 요청으로 실행 결과 받기
      const response2 = await axios.get(
        `http://chosuncnl.shop:2358/submissions/${token}?base64_encoded=true`,
      );
      const result = response2.data;

      // stdout과 compile_output 체크
      let output;
      if (result.stdout) {
        output = Buffer.from(result.stdout, 'base64').toString('utf-8');
      } else if (result.compile_output) {
        output = Buffer.from(result.compile_output, 'base64').toString('utf-8');
      } else {
        output = 'No output available.';
      }

      // 출력 결과 설정
      setOutput(output);
      return output;
    } catch (error) {
      setOutput('Error executing code.');
      return 'Error executing code.';
    } finally {
      setIsLoading(false);
    }
  };

  // 제출 서브미션
  const mutation = useMutation({
    mutationFn: (data: any) =>
      postContestSubmission(contestId, problemId, data),
    onMutate: () => {
      setIsSubmitLoading(true);
    },
    onSuccess: (data) => {
      setSubmitResult(data?.data?.result === 0 ? '정답입니다.' : '오답입니다.');
      setSubmitMemory(data?.data?.statistic_info?.memory_cost);
      setSubmitTime(data?.data?.statistic_info?.time_cost);
      setIsModalVisible(true); // 모달 열기
    },
    onError: (error: any) => {
      if (error.response?.data?.message === '로그인이 필요합니다.') {
        setIsLoading(false);
        message.error('로그인이 필요합니다.');
        router.push('/');
      } else {
        setIsLoading(false);
        message.error(error.response?.data?.message || '오류가 발생했습니다.');
      }
    },
    onSettled: () => {
      refetch();
      setIsSubmitLoading(false);
    },
  });

  const onSubmit = () => {
    if (!selectedLanguage) {
      message.error('언어를 선택해주세요.');
      return;
    }

    const formattedData = {
      code: code,
      language: selectedLanguage,
    };

    mutation.mutate(formattedData);
  };
  // 언어 선택 핸들러 함수
  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    switch (value) {
      case 'C':
        setCode(codeTemplate.c);
        break;
      case 'C++':
        setCode(codeTemplate.cpp);
        break;
      case 'Python3':
        setCode(codeTemplate.python);
        break;
      case 'Java':
        setCode(codeTemplate.java);
        break;
      case 'Rust':
        setCode(codeTemplate.rust);
        break;
      default:
        setCode('');
    }
  };

  // 초기화 버튼 클릭 핸들러 함수
  const handleResetCode = () => {
    switch (selectedLanguage) {
      case 'C':
        setCode(codeTemplate.c);
        break;
      case 'C++':
        setCode(codeTemplate.cpp);
        break;
      case 'Python3':
        setCode(codeTemplate.python);
        break;
      case 'Java':
        setCode(codeTemplate.java);
        break;
      case 'Rust':
        setCode(codeTemplate.rust);
        break;
      default:
        setCode('');
    }
  };

  // 모달 열기/닫기 함수
  const toggleModal = () => {
    setIsModalVisible((prev) => !prev);
  };

  // 테스트케이스 모달 열기/닫기 함수
  const toggleTestCaseModal = () => {
    setIsTestCaseModalVisible((prev) => !prev);
  };

  // 뒤로 가기
  const handleBack = () => {
    router.back();
  };

  // if (!isViewerReady) {
  //   return null;
  // }

  if (!isViewerReady || !isFontReady) {
    return null;
  }

  return (
    <div className="h-[100dvh] flex flex-col text-gray-800 ">
      <Link href="/">
        <div className="flex items-center h-20 px-4 text-white lg:h-14 bg-darkPrimary sm:px-12 cursor-pointer">
          <div className="relative mr-3 w-9 h-9">
            <Image
              src={'/commons/whiteSymbol.png'}
              alt="Logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <span className="text-lg">Chosun Online Judge</span>
        </div>
      </Link>

      {/* 문제 이름 */}
      <div className="w-full h-14 border-b-[1.5px] bg-white border-gray-300 px-4 sm:px-12 flex justify-between items-center">
        <div className="space-x-2 sm:space-x-4 flex items-center">
          <button
            className={`mt-4  pb-3 ${!isSubmitVisible ? 'text-primary border-primary border-b-[4px] font-semibold ' : 'text-gray-400 border-gray-400'}`}
            onClick={() => setIsSubmitVisible(!isSubmitVisible)}
          >
            <div className="max-w-28 sm:max-w-96 overflow-hidden text-ellipsis whitespace-nowrap">
              {problemData.title}
            </div>
          </button>

          <button
            className={`mt-4  pb-3 ${isSubmitVisible ? 'text-primary border-primary border-b-[4px] font-semibold ' : 'text-gray-400 border-gray-400'}`}
            onClick={() => setIsSubmitVisible(!isSubmitVisible)}
          >
            제출 내역
          </button>
        </div>
        <div className="flex items-center">
          <div className="sm:hidden">
            {/* sm 이하에서만 보이는 토글 버튼 그룹 */}
            <ToggleButtonGroup
              color="primary"
              value={isLeftVisible ? 'left' : 'right'}
              exclusive
              onChange={(event, newAlignment) => {
                if (newAlignment !== null) {
                  setIsLeftVisible(newAlignment === 'left');
                }
              }}
              aria-label="Section Visibility"
            >
              <ToggleButton value="left" sx={{ fontWeight: 900 }}>
                문제 설명
              </ToggleButton>
              <ToggleButton value="right" sx={{ fontWeight: 900 }}>
                에디터
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <Select
            id="language-select"
            placeholder="언어"
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="w-24"
          >
            {availableLanguages.map((language: string) => (
              <Option key={language} value={language}>
                {language}
              </Option>
            ))}
          </Select>
          {isServerStatusLoading ? (
            <div className="hidden sm:flex ml-2 items-center w-20 h-10 bg-white rounded-full shadow-lg border border-gray-300 px-1">
              <span className="flex-1 text-gray-400 text-xs text-center ">
                Judge
              </span>
              <div className="w-5 h-5 bg-gradient-to-br from-gray-400 to-gray-500 animate-pulse rounded-full shadow-md  "></div>
            </div>
          ) : serverStatus === 'normal' ? (
            <div className="hidden sm:flex ml-2 items-center w-20 h-10 bg-white rounded-full shadow-lg border border-gray-300 px-1">
              <span className="flex-1 text-gray-400 text-xs text-center ">
                Judge
              </span>
              <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-teal-500 animate-pulse rounded-full shadow-md  "></div>
            </div>
          ) : (
            <div className="hidden sm:flex ml-2 items-center w-20 h-10 bg-white rounded-full shadow-lg border border-gray-300 px-1">
              <span className="flex-1 text-gray-400 text-xs  text-center">
                Judge
              </span>
              <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-orange-400 animate-pulse rounded-full shadow-md "></div>
            </div>
          )}
        </div>
      </div>

      {/* 가변 섹션 */}
      <div className="flex flex-1 min-h-0 bg-white">
        {/* sm 이상에서는 좌/우 분할된 화면 */}
        <div className="hidden w-full sm:flex">
          <Split className="flex flex-1" sizes={[50, 50]} minSize={200}>
            {/* 왼쪽 섹션 */}
            {!isSubmitVisible ? (
              <div className="px-12 space-y-5 overflow-auto w-[50%] pb-11">
                <h1 className="mt-5 font-semibold">문제 설명</h1>
                <Viewer
                  initialValue={problemData.description || '내용이 없습니다.'}
                />
                <hr className="border-[1px] border-gray-200" />
                <h1 className="font-semibold">제한 사항</h1>

                <pre className="text-xs bg-gray-300 rounded-md p-3">
                  <code>
                    메모리 제한: {problemData.memory_limit}MB
                    <br />
                    시간 제한: {problemData.time_limit}ms
                    <br />
                    사용 언어: {problemData.languages.join(', ')}
                  </code>
                </pre>
              </div>
            ) : (
              <div className="w-full h-full px-3 overflow-auto">
                <table className="w-full table-auto text-center border-t">
                  <thead className="border-b-2 text-gray-500 text-xs ">
                    <tr>
                      <th className="py-1 font-normal">제출 일시</th>
                      <th className="py-1 font-normal">언어</th>
                      <th className="py-1 font-normal">Time</th>
                      <th className="py-1 font-normal">Memory</th>
                      <th className="py-1 font-normal">채점 내역</th>
                    </tr>
                  </thead>
                  <tbody className="w-full text-gray-600 text-xs">
                    {submissionList.map((submission: any) => (
                      <>
                        <tr
                          className="hover:bg-gray-50 border-b cursor-pointer"
                          onClick={() => toggleSubmissionCode(submission.id)}
                        >
                          <td className="py-3 font-normal">
                            {formattedDate(submission.create_time)}
                          </td>
                          <td className="py-3 font-normal">
                            {submission.language}
                          </td>
                          <td className="py-3 font-normal">
                            {submission?.statistic_info?.time_cost}
                            &nbsp;ms
                          </td>
                          <td className="py-3 font-normal">
                            {submission?.statistic_info?.memory_cost
                              ? (
                                  submission.statistic_info.memory_cost /
                                  (1024 * 1024)
                                ).toFixed(2) + ' MB'
                              : 'N/A'}
                          </td>
                          <td
                            className={`py-3 font-normal
  ${submission.result === 0 ? 'text-green-500' : 'text-red-500'}
  `}
                          >
                            {submission.result === 0 ? '정답' : '오답'}
                          </td>
                        </tr>
                        {selectedSubmissionId === submission.id && (
                          <tr>
                            <td colSpan={5} className="px-4 py-2 text-left">
                              <pre className="bg-[#1E1E1E] text-[#D4D4D4] p-2 rounded-sm">
                                <code>{submission.code}</code>
                              </pre>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
                {/* 페이지네이션 */}
                <div className="flex items-center justify-center mt-5 space-x-1">
                  <button
                    onClick={() => changePageBlock(false)}
                    disabled={currentBlock === 1}
                    className={`px-3 py-1 bg-white rounded-2xl shadow-md hover:bg-[#eeeff3]
            ${currentBlock === 1 ? 'opacity-40' : ''}
            `}
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
                    className={`px-3 py-1 bg-white rounded-2xl shadow-md hover:bg-[#eeeff3]
          ${currentBlock === 1 ? 'opacity-40' : ''}
          `}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}

            {/* 오른쪽 섹션 */}
            <Split direction="vertical" sizes={[70, 30]} minSize={100}>
              <div className="h-full overflow-auto ">
                <MonacoEditor
                  //@ts-ignore
                  language={languageMap[selectedLanguage]}
                  theme="vs-dark"
                  value={code}
                  onChange={(newCode) => setCode(newCode || '')}
                  options={{
                    suggestOnTriggerCharacters: false,
                    quickSuggestions: false,
                    tabCompletion: 'off',
                  }}
                />
              </div>

              <div className="overflow-auto  bg-[#1E1E1E] text-[#D4D4D4]">
                <h1 className="px-5 py-3 font-medium border-b border-[#D4D4D4]">
                  실행 결과
                </h1>
                <div className="px-5 py-3 text-sm">
                  {isLoading ? (
                    <div style={{ color: 'white' }}>
                      <CircularProgress color="inherit" />
                    </div>
                  ) : (
                    <pre>
                      <code>{output}</code>
                    </pre>
                  )}
                </div>
              </div>
            </Split>
          </Split>
        </div>

        {/* sm 이하에서는 좌/우 토글된 화면 */}
        <div className="flex w-screen h-full sm:hidden">
          {isLeftVisible ? (
            !isSubmitVisible ? (
              <div className="w-full px-4 space-y-5 overflow-auto sm:px-12 pb-8 ">
                <h1 className="mt-5 font-semibold">문제 설명</h1>
                <Viewer
                  initialValue={problemData.description || '내용이 없습니다.'}
                />
                <hr className="border-[1px] border-gray-200" />
                <h1 className="font-semibold">제한 사항</h1>
                <pre className="text-xs bg-gray-300 rounded-md p-3">
                  <code>
                    메모리 제한: {problemData.memory_limit}MB
                    <br />
                    시간 제한: {problemData.time_limit}ms
                    <br />
                    사용 언어: {problemData.languages.join(', ')}
                  </code>
                </pre>
              </div>
            ) : (
              <div className="w-full h-full px-3 overflow-auto">
                <table className="w-full table-auto text-center border-t">
                  <thead className="border-b-2 text-gray-500 text-xs ">
                    <tr>
                      <th className="py-1 font-normal">제출 일시</th>
                      <th className="py-1 font-normal">언어</th>
                      <th className="py-1 font-normal">Time</th>
                      <th className="py-1 font-normal">Memory</th>
                      <th className="py-1 font-normal">채점 내역</th>
                    </tr>
                  </thead>
                  <tbody className="w-full text-gray-600 text-xs">
                    {submissionList.map((submission: any) => (
                      <>
                        <tr
                          className="hover:bg-gray-50 border-b cursor-pointer"
                          onClick={() => toggleSubmissionCode(submission.id)}
                        >
                          <td className="py-3 font-normal">
                            {formattedDate(submission.create_time)}
                          </td>
                          <td className="py-3 font-normal">
                            {submission.language}
                          </td>
                          <td className="py-3 font-normal">
                            {submission?.statistic_info?.time_cost}
                            &nbsp;ms
                          </td>
                          <td className="py-3 font-normal">
                            {submission?.statistic_info?.memory_cost
                              ? (
                                  submission.statistic_info.memory_cost /
                                  (1024 * 1024)
                                ).toFixed(2) + ' MB'
                              : 'N/A'}
                          </td>
                          <td
                            className={`py-3 font-normal
  ${submission.result === 0 ? 'text-green-500' : 'text-red-500'}
  `}
                          >
                            {submission.result === 0 ? '정답' : '오답'}
                          </td>
                        </tr>
                        {selectedSubmissionId === submission.id && (
                          <tr>
                            <td colSpan={5} className="px-4 py-2 text-left">
                              <pre className="bg-[#1E1E1E] text-[#D4D4D4] p-2 rounded-sm">
                                <code>{submission.code}</code>
                              </pre>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
                {/* 페이지네이션 */}
                <div className="flex items-center justify-center mt-5 space-x-1">
                  <button
                    onClick={() => changePageBlock(false)}
                    disabled={currentBlock === 1}
                    className={`px-3 py-1 bg-white rounded-2xl shadow-md hover:bg-[#eeeff3]
            ${currentBlock === 1 ? 'opacity-40' : ''}
            `}
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
                    className={`px-3 py-1 bg-white rounded-2xl shadow-md hover:bg-[#eeeff3]
          ${currentBlock === 1 ? 'opacity-40' : ''}
          `}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )
          ) : (
            <Split
              direction="vertical"
              sizes={[70, 30]}
              minSize={100}
              className="w-screen"
            >
              <div className="h-full overflow-auto ">
                <MonacoEditor
                  //@ts-ignore
                  language={languageMap[selectedLanguage]}
                  theme="vs-dark"
                  value={code}
                  onChange={(newCode) => setCode(newCode || '')}
                  options={{
                    suggestOnTriggerCharacters: false,
                    quickSuggestions: false,
                    tabCompletion: 'off',
                  }}
                />
              </div>

              <div className="overflow-auto  bg-[#1E1E1E] text-[#D4D4D4]">
                <h1 className="px-5 py-3 font-medium border-b border-[#D4D4D4]">
                  실행 결과
                </h1>
                <div className="px-5 py-3 text-sm">
                  {isLoading ? (
                    <Spin indicator={<LoadingOutlined spin />} size="large" />
                  ) : (
                    <pre>
                      <code>{output}</code>
                    </pre>
                  )}
                </div>
              </div>
            </Split>
          )}
        </div>
      </div>

      {/* 푸터 */}
      <div className="flex items-center justify-between px-4 text-white bg-white border-t border-gray-300 min-h-16 sm:px-12">
        <button
          className="px-4 py-2 text-gray-800 transition bg-slate-200  rounded-md hover:bg-slate-300"
          onClick={handleBack}
        >
          이전으로
        </button>
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 text-gray-800 transition bg-slate-200  rounded-md hover:bg-slate-300"
            onClick={handleResetCode}
          >
            초기화
          </button>
          <button
            className="px-4 py-2 text-gray-800 transition bg-slate-200  rounded-md hover:bg-slate-300"
            onClick={toggleTestCaseModal}
          >
            테스트 케이스
          </button>
          <button
            className="px-4 py-2 text-gray-800 transition bg-slate-200 rounded-md hover:bg-slate-300"
            onClick={runcode}
          >
            코드 실행
          </button>
          <button
            className="bg-[#002a87] text-white px-4 py-2 rounded-md hover:bg-[#00226e] transition"
            onClick={() => {
              runcode();
              onSubmit();
            }}
          >
            제출 후 채점하기
          </button>
        </div>
      </div>
      {/* 제출 후 결과 모달 */}

      {/* 제출 후 결과 모달 */}
      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 배경 어둡게 만들기 */}
          <div className="fixed inset-0 bg-black opacity-50"></div>
          {/* 모달 */}
          <div className="bg-white p-8 rounded-md shadow-lg z-50 w-[24rem] mx-auto">
            <div className="text-gray-800 text-xl mb-5 font-semibold">
              {submitResult}
            </div>
            <div className="text-gray-700 ">Time: {submitTime}&nbsp;ms</div>

            <div className="text-gray-700">
              Memory:{' '}
              {submitMemory
                ? (Number(submitMemory) / (1024 * 1024)).toFixed(2) + ' MB'
                : 'N/A'}
            </div>

            <div className="flex mt-5 justify-end gap-4">
              <button
                className="px-4 py-2 mt-4 text-white transition bg-gray-400 rounded-md hover:bg-gray-500"
                onClick={toggleModal} // 모달 닫기
              >
                닫기
              </button>
              <button
                className="px-4 py-2 mt-4 text-white transition bg-primary rounded-md hover:bg-primaryButtonHover"
                onClick={handleBack} // 뒤로가기
              >
                문제 목록으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      )}
      {isSubmitLoading && (
        <div
          className="fixed inset-0 z-50 flex flex-col space-y-4 items-center justify-center bg-black bg-opacity-50"
          style={{ color: 'white' }}
        >
          <CircularProgress color="inherit" />
          <span className="text-lg"> 채점 중 입니다.</span>
        </div>
      )}
      {/* 테스트케이스 등록 모달 */}
      {isTestCaseModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 배경 어둡게 만들기 */}
          <div className="fixed inset-0 bg-black opacity-30"></div>
          {/* 모달 */}
          <div className="bg-white p-8 rounded-md shadow-lg z-50 w-[32rem] mx-auto">
            <div className="text-gray-800 text-xl mb-5 font-semibold">
              테스트 케이스 등록
            </div>
            {/* 코드 입력 영역 */}
            <textarea
              className="w-full h-40 p-4 border rounded-md text-sm font-mono bg-gray-50 focus:outline-none"
              placeholder={`// 테스트 케이스를 입력하세요\n// 예: 3 5`}
              value={testCase} // 입력값 상태 연결
              onChange={(e) => setTestCase(e.target.value)} // 상태 업데이트
            ></textarea>
            <div className="flex mt-5 justify-end space-x-4">
              <button
                className="px-4 py-2   text-gray-800  transition bg-slate-200 rounded-md hover:bg-slate-300"
                onClick={() => {
                  setTestCase('');
                }}
              >
                초기화
              </button>

              <button
                className="px-4 py-2 text-white transition bg-primary rounded-md hover:bg-primaryButtonHover"
                onClick={() => {
                  // handleTestCase(testCaseInput); // 테스트케이스 저장 로직
                  toggleTestCaseModal();
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
