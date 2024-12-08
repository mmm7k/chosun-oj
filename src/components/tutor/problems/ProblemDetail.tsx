'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getProblem } from '@/services/problemAdmin/getProblem';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';
import { useEffect, useState } from 'react';
import { formattedDate } from '@/utils/dateFormatter';
import { GoCodescan } from 'react-icons/go';
import { MdChecklist } from 'react-icons/md';
import { TbEdit } from 'react-icons/tb';
import { FiTrash2 } from 'react-icons/fi';
import { deleteProblem } from '@/services/problemAdmin/deleteProblem';
import { Button, message, Modal, Upload } from 'antd';
import { postTestcase } from '@/services/problemAdmin/postTestcase';
import CircularProgress from '@mui/material/CircularProgress';
import { UploadOutlined } from '@ant-design/icons';

export default function ProblemDetail() {
  const pathname = usePathname();
  const router = useRouter();
  const [isTestCaseUploadModalOpen, setIsTestCaseUploadModalOpen] =
    useState<boolean>(false);
  const [selectTestcaseId, setIsSelectTestcaseId] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isMuteLoading, setIsMutateLoading] = useState(false);
  // URL의 마지막 숫자 추출
  const problemId = Number(pathname.split('/').pop());

  const { data: problemInformation } = useQuery({
    queryKey: ['problemInformation', problemId],
    queryFn: () => getProblem(problemId),
    enabled: !!problemId, // problemId가 존재할 때만 쿼리 실행
  });

  const problemData: ProblemData =
    problemInformation?.data || ({} as ProblemData);

  const [isViewerReady, setIsViewerReady] = useState(false);

  useEffect(() => {
    if (problemData.description) {
      setIsViewerReady(true);
    }
  }, [problemData.description]);

  const levelMap: { [key: string]: string } = {
    Low: 'Lv.1',
    Mid: 'Lv.2',
    High: 'Lv.3',
  };

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProblem(id),
    onSuccess: () => {
      message.success('문제가 성공적으로 삭제되었습니다.');
      router.push('/tutor/problems/list?page=1');
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

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
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

  if (!isViewerReady) {
    return null;
  }
  return (
    <div className="flex min-h-screen p-8">
      <div className="w-full h-full py-8 font-semibold bg-white shadow-lg rounded-3xl text-secondary">
        <div className="flex justify-between items-center  px-16 ">
          <section className="flex">
            <h1 className="text-lg">문제 정보</h1>
          </section>
          <div className="flex items-center gap-2">
            <GoCodescan
              className="text-base cursor-pointer lg:text-2xl hover:text-gray-500"
              onClick={() => {
                router.push(`/tutor/problems/submission/${problemId}?page=1`);
              }}
            />
            <MdChecklist
              className="text-lg cursor-pointer lg:text-2xl hover:text-gray-500"
              onClick={() => {
                setIsTestCaseUploadModalOpen(true);
                setIsSelectTestcaseId(problemId);
              }}
            />

            <TbEdit
              className="text-lg cursor-pointer lg:text-2xl hover:text-gray-500"
              onClick={() => {
                router.push(`/tutor/problems/edit/${problemId}`);
              }}
            />
            <FiTrash2
              className="text-lg cursor-pointer lg:text-2xl hover:text-gray-500"
              onClick={() => {
                handleDelete(problemId);
              }}
            />
          </div>
        </div>
        <hr className="mt-5 border-t-2 border-gray-200" />

        {/* 사용자 정보 표시 */}
        <div className="flex flex-col  text-sm">
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>ID:</span>
            <span>{problemData.id}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10  ">
            <span>출제자:</span>
            <span>{problemData.created_by?.name}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>문제 제목:</span>
            <span>{problemData.title}</span>
          </div>
          <div className="flex flex-col space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>문제 본문:</span>
            <Viewer
              initialValue={problemData.description || '내용이 없습니다.'}
            />
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>공개 여부:</span>
            <span>{problemData.is_visible ? '공개' : '비공개'}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>문제 타입:</span>
            <span>{problemData.is_public ? '공통문제' : '대회/과제용'}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>시간 제한:</span>
            <span>{problemData.time_limit}ms</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>메모리 제한:</span>
            <span>{problemData.memory_limit}mb</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>태그:</span>
            <span>{problemData.tags?.join(', ') || '태그 정보 없음'}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>난이도:</span>
            {levelMap[problemData.difficulty as keyof typeof levelMap]}
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>점수:</span>
            <span>
              {problemData.test_case_score[0]?.score || '점수 정보 없음'}
            </span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10 ">
            <span>언어:</span>
            <span>{problemData.languages?.join(', ') || '언어 정보 없음'}</span>
          </div>

          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>생성 시간:</span>
            <span>{formattedDate(problemData.create_time)}</span>
          </div>
          <div className="flex space-x-2 border-b-[1.5px] border-gray-200 py-5 px-10">
            <span>마지막 수정 시간:</span>
            <span>
              {problemData.last_update_time
                ? formattedDate(problemData.last_update_time)
                : formattedDate(problemData.create_time)}
            </span>
          </div>
        </div>
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
